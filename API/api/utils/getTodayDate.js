const formatDate = require(`./formatDate`)
const { resetTime } = require(`../../config`)

const getTodayDate = ()=>{
    let todayDate = new Date()

    if(formatDate(new Date()).hour < resetTime)
        todayDate.setDate(todayDate.getDate() - 1)

    todayDate = formatDate(todayDate)

    return `${todayDate.day}-${todayDate.month}-${todayDate.year}`
}

module.exports = getTodayDate