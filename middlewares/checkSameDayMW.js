const { parse, isAfter } = require("date-fns")
const getTodayDate = require("../api/utils/getTodayDate")
const {
  errors: { serverError },
} = require("../constants/index")

async function checkSameDayMW(req, res, next) {
  const date = req.params.title || "00-00-0000"

  try {
    const postDate = parse(date, "dd-MM-yyyy", new Date())
    const todayDate = parse(getTodayDate(), "dd-MM-yyyy", new Date())

    if (isAfter(postDate, todayDate))
      return custom(`you can no longer interact with it`, 400, {
        reason: "You could only interact on the day it was created",
      })

    return next()
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = checkSameDayMW
