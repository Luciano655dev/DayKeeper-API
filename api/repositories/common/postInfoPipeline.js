const postValidationPipeline = require("./postValidationPipeline")
const getTodayDate = require("../../utils/getTodayDate")
const {
  user: { defaultTimeZone },
} = require("../../../constants/index")

const postInfoPipeline = (mainUser) => [
  ...postValidationPipeline(mainUser),
  {
    $lookup: {
      from: "postLikes",
      let: { postId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$postId", "$$postId"] },
          },
        },
        {
          $group: {
            _id: null,
            totalLikes: { $sum: 1 },
            userLiked: {
              $sum: {
                $cond: [{ $eq: ["$userId", mainUser._id] }, 1, 0],
              },
            },
          },
        },
      ],
      as: "like_info",
    },
  },
  {
    $unwind: {
      path: "$like_info",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "postComments",
      let: { postId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$postId", "$$postId"] },
          },
        },
        {
          $group: {
            _id: null,
            totalComments: { $sum: 1 },
            userCommented: {
              $push: {
                $cond: [
                  { $eq: ["$userId", mainUser._id] },
                  {
                    comment: "$comment",
                    gif: "$gif",
                    created_at: "$created_at",
                  },
                  false,
                ],
              },
            },
          },
        },
      ],
      as: "comment_info",
    },
  },
  {
    $unwind: {
      path: "$comment_info",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $addFields: {
      relevance: {
        $sum: ["$like_info.totalLikes", "$comment_info.totalComments"],
      },
      isToday: { $eq: ["$title", getTodayDate()] },
      timeZoneMatch: { $eq: ["user_info.timeZone", mainUser.timeZone] },
      likes: { $ifNull: ["$like_info.totalLikes", 0] },
      userLiked: { $gt: ["$like_info.userLiked", 0] },
      comments: { $ifNull: ["$comment_info.totalComments", 0] },
      userCommented: { $ifNull: ["$comment_info.userCommented", false] },
      created_at: {
        $dateToString: {
          format: "%Y-%m-%d %H:%M:%S",
          date: "$created_at",
          timezone: mainUser.timeZone || defaultTimeZone,
        },
      },
    },
  },
  {
    $project: {
      _id: 1,
      title: 1,
      data: 1,
      user: 1,
      files: 1,
      created_at: 1,
      likes: 1,
      userLiked: 1,
      comments: 1,
      userCommented: 1,
      user_info: 1,
    },
  },
]

module.exports = postInfoPipeline
