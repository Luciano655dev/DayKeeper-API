const User = require('../../models/User')
const getDataWithPages = require('../getDataWithPages')
const { userPostsPipeline } = require('../../repositories')

const {
    success: { fetched }
} = require('../../../constants/index')

const getUserPosts = async({ page, maxPageSize, order, name, id })=>{
    try{
        let mainUser = await User.findById(id)

        const response = getDataWithPages({
            type: 'Post',
            pipeline: userPostsPipeline(mainUser, name),
            order,
            page,
            maxPageSize
        })

        return fetched(`user's posts`, { response })
    }catch(error){
        throw new Error(`${error}`)
    }
}

module.exports = getUserPosts