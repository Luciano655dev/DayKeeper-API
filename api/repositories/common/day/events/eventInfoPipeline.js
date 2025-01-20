const dayElementValidationPipeline = require("../dayElementValidationPipeline")
const {
  user: { defaultTimeZone },
} = require("../../../../../constants/index")

const eventInfoPipeline = (mainUser) => [
  ...dayElementValidationPipeline(mainUser),
  {
    $addFields: {
      dateStart: {
        $dateToString: {
          format: "%Y-%m-%d %H:%M:%S",
          date: "$dateStart",
          timezone: mainUser.timeZone || defaultTimeZone,
        },
      },
      dateEnd: {
        $dateToString: {
          format: "%Y-%m-%d %H:%M:%S",
          date: "$dateEnd",
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
  {
    $project: {
      _id: 1,
      title: 1,
      description: 1,
      dateStart: 1,
      dateEnd: 1,
      location: 1,
      user: 1,
      user_info: 1,
      created_at: 1,
    },
  },
]

module.exports = eventInfoPipeline
