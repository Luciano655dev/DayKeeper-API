const handleRekognition = require("../services/webhooks/handleRekognition")
const getJobStatus = require("../services/webhooks/getJobStatus")

const handleRekognitionController = async (req, res) => {
  try {
    const { code, message } = await handleRekognition(req)

    return res.status(code).send(message)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const getJobStatusController = async (req, res) => {
  try {
    const { code, message, data } = await getJobStatus(req)

    return res.status(code).json({ message, data })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

module.exports = {
  handleRekognition: handleRekognitionController,
  getJobStatus: getJobStatusController,
}
