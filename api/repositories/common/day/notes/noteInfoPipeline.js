const dayElementValidationPipeline = require("../dayElementValidationPipeline")
const {
  user: { defaultTimeZone },
} = require("../../../../../constants/index")

const noteInfoPipeline = (mainUser) => {
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
        text: 1,
        privacy: 1,
        user: 1,
        user_info: 1,

        date: 1,
        created_at: 1,

        // for display
        dateLocal: 1,
      },
    },
  ]
}

module.exports = noteInfoPipeline
