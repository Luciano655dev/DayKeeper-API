const User = require('../../models/User')
const mongoose = require('mongoose')
const { hideUserData } = require('../../repositories')
const {
    errors: { notFound },
    success: { fetched }
} = require('../../../constants')

const getUser = async(props) => {
    const { name: userInput, loggedUserId } = props

    try {
        /* Search by name or id */
        let user = await User.findOne({ name:   userInput }).select(hideUserData)
        if (!user && mongoose.isValidObjectId(userInput))
            user = await User.findById(String(userInput)).select(hideUserData)

        if (!user)
            return notFound('User')

        const loggedUser = await User.findById(loggedUserId).select("-password")

        let status = `error`
        if(user._doc.followers.includes(loggedUserId.toString()))
            status = `following`
        else if(loggedUser.blocked_users.includes(user._id.toString()))
            status = `blocked`
        else if(user._doc._id == loggedUserId.toString())
            status = `logged`
        else
            status = `default`

        return fetched(`user`, { user: {
            ...user._doc,
            followers: user._doc.followers.length,
            status
        } })
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = getUser