const User = require(`../../models/User`)
const getDataWithPages = require(`../getDataWithPages`)
const userStoriesPipeline = require(`../../repositories/userStoriesPipeline`)

const {
    errors: { notFound },
    success: { fetched }
} = require('../../../constants/index')

const getUserStories = async(props)=>{
    let {
        name,
        order,
        loggedUserId,
        following,
        page,
        maxPageSize
    } = props

    try{
        const mainUser = await User.findById(loggedUserId)
        if(!mainUser)
            return notFound(`User`)

        const response = await getDataWithPages({
            type: `Storie`,
            pipeline: userStoriesPipeline(mainUser, name),
            order: order == `recent` ? order : `relevant`,
            following: `following`,
            page,
            maxPageSize
        }, mainUser)

        return fetched("User Stories", { response })
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = getUserStories