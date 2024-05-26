module.exports = {
  // the information that the user cannot obtain
  hideUserData: '-password -ban_history -reports -follow_requests -blocked_users -verified_email -roles -banned',
  hidePostData: '-reports -ban_history',
  searchPostPipeline: (searchQuery, mainUser, todayDate) => [
    {
      $lookup: {
        from: 'users',
        let: { userId: { $toObjectId: '$user' } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$userId'] }
            }
          },
          {
            $project: {
              password: 0,
              ban_history: 0,
              reports: 0,
              follow_requests: 0,
              blocked_users: 0,
              verified_email: 0,
              roles: 0,
              banned: 0
            }
          }
        ],
        as: 'user_info'
      }
    },
    {
      $match: {
        $and: [
          { 'user': { $nin: mainUser.blocked_users } },
          { 'user_info.banned': { $ne: "true" } },
          {
            $or: [
              { title: { $regex: new RegExp(searchQuery, 'i') } },
              { 'user_info.name': { $regex: new RegExp(searchQuery, 'i') } }
            ]
          },
          {
            $or: [
              { 'user_info.private': false },
              { 
                $and: [
                  { 'user_info.private': true },
                  { 'user_info.followers': mainUser._id }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      $addFields: {
        relevance: { $sum: ['$reactions', '$comments'] },
        isToday: { $eq: ['$title', todayDate] }
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        data: 1,
        user: 1,
        files: 1,
        created_at: 1,
        reactions: 1,
        comments: { $size: '$comments' },
        user_info: { $arrayElemAt: ['$user_info', 0] }
      }
    }
  ],
  searchUserPipeline: (searchQuery, mainUser) => [
    {
      $match: {
        $and: [
          { '_id': { $nin: mainUser.blocked_users } },
          { 'banned': { $ne: true } },
          {
            name: { $regex: new RegExp(searchQuery, 'i') }
          },
          {
            $or: [
              { private: false },
              { 
                $and: [
                  { private: true },
                  { followers: mainUser._id }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      $project: {
        password: 0,
        ban_history: 0,
        reports: 0,
        follow_requests: 0,
        blocked_users: 0,
        verified_email: 0,
        roles: 0,
        banned: 0
      }
    }
  ],
  userPostsPipeline: (mainUser, name) => [
    {
      $lookup: {
        from: 'users',
        let: { userId: { $toObjectId: '$user' } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$userId'] }
            }
          },
          {
            $project: {
              password: 0,
              ban_history: 0,
              reports: 0,
              follow_requests: 0,
              blocked_users: 0,
              verified_email: 0,
              roles: 0,
              banned: 0
            }
          }
        ],
        as: 'user_info'
      }
    },
    {
      $addFields: {
        user_info: { $arrayElemAt: ['$user_info', 0] }
      }
    },
    {
      $match: {
        $and: [
          { 'user': { $nin: mainUser.blocked_users } },
          {
            'user_info.name': name
          },
          {
            $or: [
              { 'user_info.private': false },
              { 
                $and: [
                  { 'user_info.private': true },
                  { 'user_info.followers': mainUser._id }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        data: 1,
        user: 1,
        files: 1,
        created_at: 1,
        reactions: 1,
        comments: { $size: '$comments' },
        user_info: 1
      }
    }
  ],
  reportedElementPipeline: [
    {
      $match: {
        $and: [
          { 
            'banned': "false"
          },
          {
            reports: {
              $exists: true,
              $not: { $size: 0 }
            }
          }
        ]
      },
    },
    {
      $addFields: {
        numReports: { $size: "$reports" }
      },
    }
  ],
  bannedElementPipeline: (loggedUserId) => [
    {
      $addFields: {
        latestBan: {
          $arrayElemAt: ["$ban_history", -1]
        }
      }
    },
    {
      $match: {
        $and: [
          {
            'banned': "true"
          },
          {
            "latestBan.banned_by": loggedUserId
          }
        ]
      }
    }
  ]
}