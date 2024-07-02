const getDataWithPages = require(`../../getDataWithPages`)
const { bannedElementPipeline } = require(`../../../repositories`)
const { success: { fetched } } = require(`../../../../constants/index`)

const getBannedPosts = async(props)=>{
    const {
        page,
        maxPageSize,
        loggedUser
    } = props
    
    try{
        const response = await getDataWithPages({
            type: `Storie`,
            pipeline: bannedElementPipeline(loggedUser._id),
            order: `recent_ban`,
            page,
            maxPageSize
        })

        return fetched(`banned posts`, response)
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = getBannedPosts