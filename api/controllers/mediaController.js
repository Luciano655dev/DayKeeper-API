const getMedia = require("../services/media/getMediaById")
const {
  errors: { serverError },
} = require("../../constants/index")

const getMediaByIdController = async (req, res) => {
  try {
    const { code, message, media } = await getMedia({
      ...req.params,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, media })
  } catch (error) {
    return res.status(500).json({ message: serverError(`${error}`) })
  }
}

module.exports = {
  getMediaById: getMediaByIdController,
}
