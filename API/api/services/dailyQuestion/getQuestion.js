const { format, parse, isAfter, subDays } = require('date-fns')
const DailyQuestion = require(`../../models/DailyQuestion`)
const { getTodayDate } = require(`../../utils/getTodayDate`)
const { resetTime } = require(`../../../config`)

const {
    errors: { invalidValue, notFound, custom },
    success: { fetched }
} = require(`../../../constants/index`)

const getQuestion = async (props) => {
    const { date } = props

    try {
        const dateRegexFormat = /^\d{2}-\d{2}-\d{4}$/ // dd-MM-yyyy
        if (!dateRegexFormat.test(date))
            return invalidValue(`date`)

        const now = new Date()
        const requestedDate = parse(date, 'dd-MM-yyyy', new Date())

        if (isAfter(requestedDate, now))
            return custom(400, `you cannot enter a future date`)

        let adjustedNow = now
        const currentHour = format(now, 'H')

        if (currentHour < resetTime)
            adjustedNow = subDays(now, 1)

        let queryDateString
        if (date === getTodayDate)
            queryDateString = format(requestedDate, 'dd-MM')
        else
            queryDateString = format(adjustedNow, 'dd-MM')

        const question = await DailyQuestion.findOne({ day: queryDateString })

        if (!question)
            return notFound(`question`)

        return fetched(`question`, { question })
    } catch (error) {
        console.log(error.message)
        throw new Error(error.message)
    }
}

module.exports = getQuestion