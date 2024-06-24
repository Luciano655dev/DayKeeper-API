const DailyQuestion = require(`../../models/DailyQuestion`)
const { resetTime } = require(`../../../config`)
const formatDate = require(`../../utils/formatDate`)

const {
    errors: { invalidValue, notFound, custom },
    success: { fetched }
} = require(`../../../constants/index`)

const getQuestion = async (props) => {
    const { date } = props

    try {
        const dateRegexFormat = /^\d{2}-\d{2}-\d{4}$/

        if (!dateRegexFormat.test(date))
            return invalidValue(`date`)

        const [questionDay, questionMonth, questionYear] = date.split('-').map(Number)
        let now = new Date()
        let todayDate = formatDate(now)

        const requestedDate = new Date(questionYear, questionMonth - 1, questionDay)
        if (requestedDate > now)
            return custom(400, `you can not enter a future date`)

        if (todayDate.hour < resetTime)
            now.setDate(now.getDate() - 1)

        const adjustedDate = formatDate(now)
        let queryDateString = `${adjustedDate.day}-${adjustedDate.month}`

        if (date === `${todayDate.day}-${todayDate.month}-${todayDate.year}`)
            queryDateString = `${adjustedDate.day}-${adjustedDate.month}`
        else
            queryDateString = `${questionDay}-${questionMonth}`

        let question = await DailyQuestion.findOne({ day: queryDateString })

        if (!question)
            return notFound(`question`)

        return fetched(`question`, { question })
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = getQuestion
