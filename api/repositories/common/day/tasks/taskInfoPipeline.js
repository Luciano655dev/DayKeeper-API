const dayElementValidationPipeline = require("../dayElementValidationPipeline")
const {
  user: { defaultTimeZone },
} = require("../../../../../constants/index")

const eventInfoPipeline = (mainUser) => [
  ...dayElementValidationPipeline(mainUser),
  {
    $addFields: {
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
  {
    $project: {
      _id: true,
      title: true,
      value: true,
      privacy: true,
      user: true,
      user_info: true,
      created_at: true,
    },
  },
]

module.exports = eventInfoPipeline
