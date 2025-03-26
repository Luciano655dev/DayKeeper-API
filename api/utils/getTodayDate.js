const { format } = require(`date-fns`)

const getTodayDate = () => {
  let todayDate = format(new Date(), `dd-MM-yyyy`)

  return todayDate
}

module.exports = getTodayDate
