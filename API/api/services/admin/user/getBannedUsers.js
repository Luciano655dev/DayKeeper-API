const getDataWithPages = require(`../../getDataWithPages`)
const { bannedElementPipeline } = require(`../../../repositories`)
const { success: { fetched } } = require(`../../../../constants`)

const getBannedUsers = async(props) => {
    const {
        page,
        maxPageSize,
        loggedUserId
    } = props
    
    try{

        const response = await getDataWithPages({
            type: `User`,
            pipeline: bannedElementPipeline(loggedUserId),
            order: `recent_ban`,
            page,
            maxPageSize
        })

        return fetched(`banned users`, { response })
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = getBannedUsers