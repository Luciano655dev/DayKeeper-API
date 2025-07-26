const {
  errors: { serverError },
} = require("../../constants/index")

//  SERVICES
const createStorie = require(`../services/stories/createStorie`)
const deleteStorie = require(`../services/stories/deleteStories`)
const likeStorie = require(`../services/stories/likeStorie`)
const getStorieLikes = require(`../services/stories/getStorieLikes`)
const reportStorie = require(`../services/stories/reportStorie`)
const getStorie = require(`../services/stories/getStorie`)
const getTodayStories = require(`../services/stories/getTodayStories`)
const getUserStories = require(`../services/stories/getUserStories`)
const getStorieViews = require(`../services/stories/getStorieViews`)
const getUserStoriesFeed = require("../services/stories/getUserStoriesFeed")

const createStorieController = async (req, res) => {
  if (!req?.mediaDocs || req?.mediaDocs?.length <= 0)
    return res.status(400).json({ message: `The file need to be filled in` })

  try {
    const { code, message, storie } = await createStorie({
      placeIds: req?.body?.placesId,
      mediaDocs: req?.mediaDocs,
      privacy: req?.body?.privacy,
      text: req.body.text,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, storie })
  } catch (error) {
    return serverError(`${error}`)
  }
}

const deleteStorieController = async (req, res) => {
  try {
    const { code, message } = await deleteStorie({
      ...req.params,
      loggedUser: req?.user,
    })

    return res.status(code).json({ message })
  } catch (error) {
    return serverError(`${error}`)
  }
}

const likeStorieController = async (req, res) => {
  try {
    const { code, message, storie } = await likeStorie({
      ...req.params,
      ...req.body,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, storie })
  } catch (error) {
    return serverError(`${error}`)
  }
}

const reportStorieController = async (req, res) => {
  try {
    const { code, message, storie } = await reportStorie({
      ...req.params,
      ...req.body,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, storie })
  } catch (error) {
    return serverError(`${error}`)
  }
}

// ========== GET ==========
const getStorieController = async (req, res) => {
  try {
    const { code, message, data } = await getStorie({
      ...req.params,
      populate: req.query.populate,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, data })
  } catch (error) {
    console.log(error)
    return serverError(`${error}`)
  }
}

const getTodayStoriesController = async (req, res) => {
  try {
    const { code, message, data } = await getTodayStories({
      ...req.params,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, data })
  } catch (error) {
    console.log(error)
    return serverError(`${error}`)
  }
}

const getUserStoriesController = async (req, res) => {
  try {
    const { code, message, response } = await getUserStories({
      loggedUser: req.user,
      ...req.params,
      ...req.query,
    })

    return res.status(code).json({ message, ...response })
  } catch (error) {
    return serverError(`${error}`)
  }
}

const getStorieViewsController = async (req, res) => {
  const page = Number(req.query?.page) || 1
  const maxPageSize = req.query?.maxPageSize
    ? Number(req.query?.maxPageSize) <= 100
      ? Number(req.query?.maxPageSize)
      : 100
    : 1

  try {
    const { code, message, response } = await getStorieViews({
      ...req.params,
      loggedUser: req.user,
      page,
      maxPageSize,
    })

    return res.status(code).json({ message, ...response })
  } catch (error) {
    return res.status(500).json({ message: `${error}` })
  }
}

const getStorieLikesController = async (req, res) => {
  const page = Number(req.query?.page) || 1
  const maxPageSize = req.query?.maxPageSize
    ? Number(req.query?.maxPageSize) <= 100
      ? Number(req.query?.maxPageSize)
      : 100
    : 1

  try {
    const { code, message, response } = await getStorieLikes({
      ...req.params,
      loggedUser: req.user,
      page,
      maxPageSize,
    })

    return res.status(code).json({ message, ...response })
  } catch (error) {
    return res.status(500).json({ message: `${error}` })
  }
}

const getUserStoriesFeedController = async (req, res) => {
  const page = Number(req.query?.page) || 1
  const maxPageSize = req.query?.maxPageSize
    ? Number(req.query?.maxPageSize) <= 100
      ? Number(req.query?.maxPageSize)
      : 100
    : 1

  try {
    const { code, message, response } = await getUserStoriesFeed({
      loggedUser: req.user,
      page,
      maxPageSize,
    })

    return res.status(code).json({ message, ...response })
  } catch (error) {
    return res.status(500).json({ message: `${error}` })
  }
}

module.exports = {
  createStorie: createStorieController,
  deleteStorie: deleteStorieController,
  likeStorie: likeStorieController,
  reportStorie: reportStorieController, // story

  getStorie: getStorieController,
  getTodayStories: getTodayStoriesController,
  getUserStories: getUserStoriesController,
  getStorieLikes: getStorieLikesController,
  getStorieViews: getStorieViewsController,
  getUserStoriesFeed: getUserStoriesFeedController,
}
