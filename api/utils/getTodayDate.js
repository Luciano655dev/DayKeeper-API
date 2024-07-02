const { format, getHours, subDays } = require(`date-fns`)
const { resetTime } = require(`../../config`)

const getTodayDate = ()=>{
    let todayDate = format(new Date(), `dd-MM-yyyy`)

    if(getHours(new Date()) < resetTime)
        todayDate = format(subDays(new Date, 1), `dd-MM-yyyy`)

    return todayDate
}

module.exports = getTodayDate