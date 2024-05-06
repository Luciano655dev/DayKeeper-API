module.exports = {
  // the information that the user cannot obtain
  hideUserData: '-password -ban_history -reports -follow_requests -blocked_users -verified_email -roles',
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
                blocked_users: 0
              }
            }
          ],
          as: 'user_info'
        }
      },
      {
        $addFields: {
          user_info: { $arrayElemAt: ['$user_info', 0] } // Seleciona o primeiro elemento da array 'user_info'
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
          reports: 0,
          ban_history: 0
        }
      }
  ]
}