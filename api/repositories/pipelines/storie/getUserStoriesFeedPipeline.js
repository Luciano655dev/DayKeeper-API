const storieInfoPipeline = require("../../common/storieInfoPipeline")

const getUserStoriesFeed = (mainUser, startOfDay, endOfDay) => [
  {
    $match: {
      user: { $ne: mainUser._id },
      created_at: { $gte: startOfDay, $lte: endOfDay },
    },
  },
  ...storieInfoPipeline(mainUser),
  {
    $sort: { created_at: 1 },
  },
  {
    $group: {
      _id: "$user",
      stories: { $push: "$$ROOT" },
      storyIds: { $push: "$_id" },
      total: { $sum: 1 },
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user",
    },
  },
  { $unwind: "$user" },
  {
    $lookup: {
      from: "storieViews",
      let: { storyIds: "$storyIds" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $in: ["$storieId", "$$storyIds"] },
                { $eq: ["$userId", mainUser._id] },
              ],
            },
          },
        },
      ],
      as: "views",
    },
  },
  {
    $addFields: {
      userViewed: {
        $eq: [{ $size: "$views" }, "$total"],
      },
    },
  },
  {
    $project: {
      _id: "$user._id",
      name: "$user.name",
      profile_picture: "$user.profile_picture",
      userViewed: 1,
      stories: {
        $map: {
          input: "$stories",
          as: "storie",
          in: {
            _id: "$$storie._id",
            file: "$$storie.file",
            text: "$$storie.text",
            created_at: "$$storie.created_at",
            privacy: "$$storie.privacy",
            date: "$$storie.date",
            userViewed: "$$storie.userViewed",
            userLiked: "$$storie.userLiked",
            likes: "$$storie.likes",
          },
        },
      },
    },
  },
]

module.exports = getUserStoriesFeed
