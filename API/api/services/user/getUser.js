const User = require('../../models/User')
const mongoose = require('mongoose')
const { hideUserData } = require('../../repositories')
const {
    errors: { notFound },
    success: { fetched }
} = require('../../../constants')

const getUser = async(props) => {
    const { name: userInput } = props

    try {
        /* Search by name or id */
        let user = await User.findOne({ name:   userInput }).select(hideUserData)
        if (!user && mongoose.isValidObjectId(userInput))
            user = await User.findById(String(userInput)).select(hideUserData)

        if (!user)
            return notFound('User')

        return fetched(`user`, { user: { ...user._doc, followers: user._doc.followers.length } })
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = getUser