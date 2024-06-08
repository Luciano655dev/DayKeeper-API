const { errors: { serverError } } = require('../../constants')

//  SERVICES
const createStorie = require(`../services/stories/createStorie`)
const deleteStorie = require(`../services/stories/deleteStories`)
const reactStorie = require(`../services/stories/reactStorie`)
const reportStorie = require(`../services/stories/reportStorie`)
const getStorie = require(`../services/stories/getStorie`)
const getUserStories = require(`../services/stories/getUserStories`)
const getStorieReactions = require(`../services/stories/getStorieReactions`)

const createStorieController = async (req, res) => {
    try {
        const { code, message } = await createStorie()

        return res.status(code).json({ message })
    } catch (error) {
        return serverError(`${error}`)
    }
}

const deleteStorieController = async (req, res) => {
    try {
        const { code, message } = await deleteStorie()

        return res.status(code).json({ message })
    } catch (error) {
        return serverError(`${error}`)
    }
}

const reactStorieController = async (req, res) => {
    try {
        const { code, message } = await reactStorie()

        return res.status(code).json({ message })
    } catch (error) {
        return serverError(`${error}`)
    }
}

const reportStorieController = async (req, res) => {
    try {
        const { code, message } = await reportStorie()

        return res.status(code).json({ message })
    } catch (error) {
        return serverError(`${error}`)
    }
}

// ========== GET ==========
const getStorieController = async (req, res) => {
    try {
        const { code, message } = await getStorie()

        return res.status(code).json({ message })
    } catch (error) {
        return serverError(`${error}`)
    }
}

const getUserStoriesController = async (req, res) => {
    try {
        const { code, message } = await getUserStories()

        return res.status(code).json({ message })
    } catch (error) {
        return serverError(`${error}`)
    }
}

const getStorieReactionsController = async (req, res) => {
    try {
        const { code, message } = await getStorieReactions()

        return res.status(code).json({ message })
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
    getStorieReactions: getStorieReactionsController
}