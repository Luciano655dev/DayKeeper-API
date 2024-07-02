const bannedElementPipeline = (loggedUserId) => [
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

module.exports = bannedElementPipeline