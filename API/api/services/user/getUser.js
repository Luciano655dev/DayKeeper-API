const User = require('../../models/User')
const mongoose = require('mongoose')
const { hideUserData } = require('../../repositories')
const { notFound } = require('../../../constants')

const getUser = async(props) => {
    const { name: userInput } = props

    try {
        /* Search by name or id */
        let user = await User.findOne({ name:   userInput }).select(hideUserData)
        if (!user && mongoose.isValidObjectId(userInput))
            user = await User.findById(String(userInput)).select(hideUserData)

        if (!user) return { code: 404, message: notFound('User'), user: null }

        return { code: 200, user: { ...user._doc, followers: user._doc.followers.length } }
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = getUser