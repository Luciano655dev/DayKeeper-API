const getDataWithPages = require(`../../getDataWithPages`)
const { bannedElementPipeline } = require(`../../../repositories`)
const { success: { fetched } } = require(`../../../../constants/index`)

const getBannedPosts = async(props)=>{
    const {
        page,
        maxPageSize,
        loggedUserId
    } = props
    
    try{

        const response = await getDataWithPages({
            type: `Post`,
            pipeline: bannedElementPipeline(loggedUserId),
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