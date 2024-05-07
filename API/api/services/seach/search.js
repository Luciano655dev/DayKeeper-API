const getDataWithPages = require('../getDataWithPages')
const { searchPostPipeline, searchUserPipeline } = require('../../repositories')
const formatDate = require('../../utils/formatDate')
const { notFound } = require('../../../constants')
const { resetTime } = require('../../../config')
const User = require('../../models/User')

const search = async (props) => {
    const page = Number(props.page) || 1
    const maxPageSize = props.maxPageSize ? ( Number(props.maxPageSize) <= 100 ? Number(props.maxPageSize) : 100) : 2

    const searchQuery = props.q || ''
    const order = props.order || 'relevant'
    const following = props.following
    const type = props.type || 'Post'

    const loggedUserId = props.id

    try {
        const mainUser = await User.findById(loggedUserId)
        mainUser.following = await User.distinct('_id', { followers: loggedUserId })
        if(!mainUser || !mainUser.following)
            return { code: 404, message: notFound('User') }

        let todayDate = formatDate(Date.now())
        todayDate = `${todayDate.hour < resetTime ? todayDate.day - 1 : todayDate.day}-${todayDate.month}-${todayDate.year}`

        const response = await getDataWithPages({
            type,
            pipeline: type == 'Post' ?
                searchPostPipeline(searchQuery, mainUser) :
                searchUserPipeline(searchQuery, mainUser),
            order,
            following,
            page,
            maxPageSize
        })

        return { code: 200, response}
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = search