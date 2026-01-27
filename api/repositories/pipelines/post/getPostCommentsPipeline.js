const mongoose = require("mongoose")
const hideUserData = require("../../hideProject/hideUserData")

const getPostCommentsPipeline = ({
  postId,
  parentCommentId = null,
  mainUser,
}) => {
  const match = {
    postId: new mongoose.Types.ObjectId(postId),
    status: { $ne: "deleted" },
  }

  if (parentCommentId === null) {
    match.parentCommentId = null
  } else if (parentCommentId) {
    match.parentCommentId = new mongoose.Types.ObjectId(parentCommentId)
  }

  return [
    { $match: match },
    {
      $lookup: {
        from: "commentLikes",
        let: { commentId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$commentId", "$$commentId"] },
                  { $ne: ["$status", "deleted"] },
                ],
              },
            },
          },
          { $count: "count" },
        ],
        as: "likesCountInfo",
      },
    },
    ...(mainUser?._id
      ? [
          {
            $lookup: {
              from: "commentLikes",
              let: { commentId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$commentId", "$$commentId"] },
                        { $eq: ["$userId", mainUser._id] },
                        { $ne: ["$status", "deleted"] },
                      ],
                    },
                  },
                },
                { $limit: 1 },
              ],
              as: "userLikedInfo",
            },
          },
        ]
      : []),
    {
      $lookup: {
        from: "postComments",
        let: { commentId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$parentCommentId", "$$commentId"] },
                  { $ne: ["$status", "deleted"] },
                ],
              },
            },
          },
          { $count: "count" },
        ],
        as: "repliesCountInfo",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        pipeline: [{ $project: hideUserData }],
        as: "commentsInfo",
      },
    },
    { $unwind: "$commentsInfo" },
    {
      $project: {
        _id: 1,
        postId: 1,
        parentCommentId: 1,
        comment: 1,
        gif: 1,
        created_at: 1,
        user: "$commentsInfo",
        likesCount: {
          $ifNull: [{ $arrayElemAt: ["$likesCountInfo.count", 0] }, 0],
        },
        repliesCount: {
          $ifNull: [{ $arrayElemAt: ["$repliesCountInfo.count", 0] }, 0],
        },
        userLiked: mainUser?._id
          ? { $gt: [{ $size: "$userLikedInfo" }, 0] }
          : false,
      },
    },
  ]
}

module.exports = getPostCommentsPipeline
