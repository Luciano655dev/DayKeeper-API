const storieValidationPipeline = require("./storieValidationPipeline")
const {
  user: { defaultTimeZone },
} = require("../../../constants/index")

const storieInfoPipeline = (mainUser) => [
  ...storieValidationPipeline(mainUser),
  {
    $lookup: {
      from: "storieLikes",
      let: { storieId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$storieId", "$$storieId"] },
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
      from: "storieViews",
      let: { storieId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$storieId", "$$storieId"] },
          },
        },
        {
          $group: {
            _id: null,
            userViewed: {
              $sum: {
                $cond: [{ $eq: ["$userId", mainUser._id] }, 1, 0],
              },
            },
          },
        },
      ],
      as: "view_info",
    },
  },
  {
    $unwind: {
      path: "$view_info",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $addFields: {
      likes: { $ifNull: ["$like_info.totalLikes", 0] },
      userLiked: { $gt: ["$like_info.userLiked", 0] },
      userViewed: { $gt: ["$view_info.userViewed", 0] },
      date: {
        $dateToString: {
          format: "%Y-%m-%d %H:%M:%S",
          date: "$date",
          timezone: mainUser.timeZone || defaultTimeZone,
        },
      },
      created_at: {
        $dateToString: {
          format: "%Y-%m-%d %H:%M:%S",
          date: "$created_at",
          timezone: mainUser.timeZone || defaultTimeZone,
        },
      },
    },
  },
]

module.exports = storieInfoPipeline
