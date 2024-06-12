const { errors: { serverError } } = require('../../constants')

//  SERVICES
const createStorie = require(`../services/stories/createStorie`)
const deleteStorie = require(`../services/stories/deleteStories`)
const reactStorie = require(`../services/stories/reactStorie`)
const reportStorie = require(`../services/stories/reportStorie`)
const getStorie = require(`../services/stories/getStorie`)
const getUserStories = require(`../services/stories/getUserStories`)

const createStorieController = async (req, res) => {
    if(!req.file) return res.status(400).json({ message: `The file need to be filled in` })

    const file = {
        name: req.file.originalname,
        key: req.file.key,
        mimetype: req.file.mimetype,
        url: req.file.location
    }

    try {
        const { code, message, storie } = await createStorie({
            file,
            text: req.body.text,
            loggedUserId: req.id
        })

        return res.status(code).json({ message, storie })
    } catch (error) {
        return serverError(`${error}`)
    }
}

const deleteStorieController = async (req, res) => {
    try {
        const { code, message } = await deleteStorie({ ...req.params })

        return res.status(code).json({ message })
    } catch (error) {
        return serverError(`${error}`)
    }
}

const reactStorieController = async (req, res) => {
    try {
        const { code, message, storie } = await reactStorie({
            ...req.params,
            ...req.body,
            loggedUserId: req.id
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
            loggedUserId: req.id
        })

        return res.status(code).json({ message, storie })
    } catch (error) {
        return serverError(`${error}`)
    }
}

// ========== GET ==========
const getStorieController = async (req, res) => {
    try {
        const { code, message, stories } = await getStorie({
            ...req.params,
            populate: req.query.populate,
            loggedUserId: req.id
        })

        return res.status(code).json({ message, stories })
    } catch (error) {
        console.log(error)
        return serverError(`${error}`)
    }
}

const getUserStoriesController = async (req, res) => {
    try {
        const { code, message, response } = await getUserStories({
            loggedUserId: req.id,
            ...req.params,
            ...req.query
        })

        return res.status(code).json({ message, ...response })
    } catch (error) {
        return serverError(`${error}`)
    }
}

module.exports = {
    createStorie: createStorieController,
    deleteStorie: deleteStorieController,
    reactStorie: reactStorieController,
    reportStorie: reportStorieController,

    getStorie: getStorieController,
    getUserStories: getUserStoriesController,
}