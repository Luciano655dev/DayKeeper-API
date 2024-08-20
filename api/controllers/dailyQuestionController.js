const getQuestion = require(`../services/dailyQuestion/getQuestion`)
const getTodayQuestion = require(`../services/dailyQuestion/getTodayQuestion`)

const getQuestionController = async (req, res) => {
  try {
    const { code, message, question } = await getQuestion(req.params)

    return res.status(code).json({ message, question })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const getTodayQuestionController = async (req, res) => {
  try {
    const { code, message, question } = await getTodayQuestion()

    return res.status(code).json({ message, question })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

module.exports = {
  getQuestion: getQuestionController,
  getTodayQuestion: getTodayQuestionController,
}
