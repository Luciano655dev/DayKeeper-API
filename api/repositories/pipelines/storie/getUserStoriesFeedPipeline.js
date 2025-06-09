const mongoose = require("mongoose")

const getUserStoriesFeed = (mainUserId, startOfDay, endOfDay) => [
  {
    $lookup: {
      from: "stories",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$user", "$$userId"] },
                { $gte: ["$created_at", startOfDay] },
                { $lte: ["$created_at", endOfDay] },
              ],
            },
          },
        },
      ],
      as: "todaysStories",
    },
  },

  // Only keep users who posted at least one story today
  {
    $match: {
      "todaysStories.0": { $exists: true },
    },
  },

  // Lookup story views for today's stories (flattened via $lookup inside)
  {
    $lookup: {
      from: "storieViews",
      let: { storyIds: "$todaysStories._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $in: ["$storieId", "$$storyIds"] },
                { $eq: ["$userId", new mongoose.Types.ObjectId(mainUserId)] },
              ],
            },
          },
        },
      ],
      as: "userViews",
    },
  },

  // Add field: userViewed = all stories viewed by main user?
  {
    $addFields: {
      totalStories: { $size: "$todaysStories" },
      viewedStories: { $size: "$userViews" },
      userViewed: {
        $eq: [{ $size: "$todaysStories" }, { $size: "$userViews" }],
      },
    },
  },

  // Optional cleanup
  {
    $project: {
      todaysStories: 0,
      userViews: 0,
      totalStories: 0,
      viewedStories: 0,
    },
  },
]

module.exports = getUserStoriesFeed
