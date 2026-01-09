const dayElementValidationPipeline = require("../dayElementValidationPipeline")
const {
  user: { defaultTimeZone },
} = require("../../../../../constants/index")

const eventInfoPipeline = (mainUser) => {
  const tz = mainUser?.timeZone || defaultTimeZone

  return [
    ...dayElementValidationPipeline(mainUser),

    {
      $addFields: {
        dateStartLocal: {
          $dateToString: {
            format: "%Y-%m-%d %H:%M:%S",
            date: "$dateStart",
            timezone: tz,
          },
        },
        dateEndLocal: {
          $dateToString: {
            format: "%Y-%m-%d %H:%M:%S",
            date: "$dateEnd",
            timezone: tz,
          },
        },
        createdAtLocal: {
          $dateToString: {
            format: "%Y-%m-%d %H:%M:%S",
            date: "$createdAt",
            timezone: tz,
          },
        },
      },
    },

    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        privacy: 1,

        // raw dates (best for client logic)
        dateStart: 1,
        dateEnd: 1,
        createdAt: 1,

        // display helpers
        dateStartLocal: 1,
        dateEndLocal: 1,
        createdAtLocal: 1,

        location: 1,
        user: 1,
        user_info: 1,
      },
    },
  ]
}

module.exports = eventInfoPipeline
