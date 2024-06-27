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
        loggedUser,
        following,
        page,
        maxPageSize
    } = props

    try{

        const response = await getDataWithPages({
            type: `Storie`,
            pipeline: userStoriesPipeline(loggedUser, name),
            order: order == `recent` ? order : `relevant`,
            following: `following`,
            page,
            maxPageSize
        }, loggedUser)

        return fetched("User Stories", { response })
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = getUserStories