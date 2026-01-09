const { isValid } = require("date-fns")

const {
  day: {
    task: { maxTitleLength },
  },
} = require("../../../../constants/index")

const ALLOWED_PRIVACY = ["public", "private", "close friends"]

const createTaskValidation = async (req, res, next) => {
  const { title, privacy, daily = false } = req.body
  const completed =
    typeof req.body.completed === "boolean" ? req.body.completed : false

  // Title (required)
  if (typeof title !== "string" || title.trim().length < 1) {
    return res.status(400).json({ message: "Task Title is required" })
  }

  if (title.trim().length > maxTitleLength) {
    return res.status(413).json({ message: "Task Title is too long" })
  }

  // daily must be boolean if provided
  if (daily !== undefined && typeof daily !== "boolean") {
    return res.status(400).json({ message: "Invalid daily value" })
  }

  // Privacy (optional)
  if (privacy !== undefined && !ALLOWED_PRIVACY.includes(privacy)) {
    return res.status(400).json({ message: "Invalid privacy value" })
  }

  // DAILY TEMPLATE: no date allowed, cannot be completed
  if (daily === true) {
    if (completed === true) {
      return res
        .status(400)
        .json({ message: "Daily task templates cannot be completed" })
    }

    // If you prefer to just ignore date instead of erroring, replace this with: delete req.body.date
    if (
      req.body.date !== undefined &&
      req.body.date !== null &&
      String(req.body.date).trim() !== ""
    ) {
      return res
        .status(400)
        .json({ message: "Daily task templates cannot have a date" })
    }

    // Normalize
    req.body.title = title.trim()
    req.body.daily = true
    req.body.completed = false
    delete req.body.value
    delete req.body.date

    return next()
  }

  // NORMAL DAY TASK: date required
  const date = req.body.date ? new Date(req.body.date) : null
  if (!date || !isValid(date)) {
    return res.status(400).json({ message: "Date is Invalid" })
  }

  // Normalize
  req.body.title = title.trim()
  req.body.date = date
  req.body.daily = false
  req.body.completed = completed
  delete req.body.value

  return next()
}

module.exports = createTaskValidation
