const DailyQuestion = require(`../../models/DailyQuestion`)
const { format } = require("date-fns")
const getTodayDate = require("../../utils/getTodayDate")

const {
  errors: { notFound },
  success: { fetched },
} = require(`../../../constants/index`)

const getQuestion = async () => {
  try {
    const todayDate = getTodayDate()

    let queryDateString = todayDate.split("-")
    queryDateString = `${queryDateString[0]}-${queryDateString[1]}`

    const question = await DailyQuestion.findOne({ day: queryDateString })

    if (!question) return notFound(`question`)

    return fetched(`question`, { question })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getQuestion
