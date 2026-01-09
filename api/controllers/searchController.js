const search = require("../services/seach/search")
const feed = require("../services/seach/feed")
const {
  errors: { serverError },
} = require("../../constants/index")

const feedController = async (req, res) => {
  try {
    const { code, response } = await feed({
      ...req.query,
      user: req.user,
    })

    return res.status(code).json(response)
  } catch (error) {
    return res.status(500).json({ message: serverError(`${error}`) })
  }
}

const searchController = async (req, res) => {
  try {
    const { code, response } = await search({
      ...req.query,
      user: req.user,
    })

    return res.status(code).json(response)
  } catch (error) {
    return res.status(500).json({ message: serverError(`${error}`) })
  }
}

module.exports = {
  feed: feedController,
  search: searchController,
}
