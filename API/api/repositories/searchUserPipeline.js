const searchUserPipeline = (searchQuery, mainUser) => [
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
]

module.exports = searchUserPipeline