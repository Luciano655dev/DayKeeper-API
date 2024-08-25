const { format, parse, isAfter } = require("date-fns")
const DailyQuestion = require(`../../models/DailyQuestion`)
const getTodayDate = require(`../../utils/getTodayDate`)

const {
  errors: { invalidValue, notFound, custom },
  success: { fetched },
} = require(`../../../constants/index`)

const getQuestion = async (props) => {
  const { date } = props

  try {
    const dateRegexFormat = /^\d{2}-\d{2}-\d{4}$/ // dd-MM-yyyy
    if (!dateRegexFormat.test(date)) return invalidValue(`Date`)

    const requestedDate = parse(date, "dd-MM-yyyy", new Date())
    const todayDate = parse(getTodayDate(), "dd-MM-yyyy", new Date())

    if (isAfter(requestedDate, todayDate))
      return custom(400, `you cannot enter a future date`)

    let queryDateString = format(requestedDate, "dd-MM")
    const question = await DailyQuestion.findOne({ day: queryDateString })

    if (!question) return notFound(`Question`)

    return fetched(`Question`, { question })
  } catch (error) {
    console.log(error.message)
    throw new Error(error.message)
  }
}

module.exports = getQuestion
