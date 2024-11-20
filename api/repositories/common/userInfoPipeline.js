const userValidationPipeline = require("./userValidationPipeline")
const followInfoPipeline = require("./user/followInfoPipeline")
const {
  user: { defaultTimeZone },
} = require("../../../constants/index")

const userInfoPipeline = (mainUser) => [
  ...followInfoPipeline(mainUser),
  ...userValidationPipeline(mainUser),
  {
    $addFields: {
      created_at: {
        $dateToString: {
          format: "%Y-%m-%d %H:%M:%S",
          date: "$created_at",
          timezone: mainUser.timeZone || defaultTimeZone,
        },
      },
    },
  },
]

module.exports = userInfoPipeline
