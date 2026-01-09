const dayElementValidationPipeline = require("../dayElementValidationPipeline")
const {
  user: { defaultTimeZone },
} = require("../../../../../constants/index")

const taskInfoPipeline = (mainUser) => {
  const tz = mainUser?.timeZone || defaultTimeZone

  return [
    ...dayElementValidationPipeline(mainUser),
    {
      $addFields: {
        dateLocal: {
          $dateToString: {
            format: "%Y-%m-%d %H:%M:%S",
            date: "$date",
            timezone: tz,
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        completed: 1,
        privacy: 1,
        user: 1,
        user_info: 1,

        // raw
        date: 1,
        created_at: 1,

        // formatted
        dateLocal: 1,
      },
    },
  ]
}

module.exports = taskInfoPipeline
