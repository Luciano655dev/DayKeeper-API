const getDataWithPages = require(`../../getDataWithPages`)
const { reportedElementPipeline } = require(`../../../repositories`)

const getReportedPosts = async(props)=>{
    const {
        page, 
        maxPageSize
    } = props

    try{
        const response = await getDataWithPages({
            type: 'Post',
            pipeline: reportedElementPipeline,
            order: 'most_reports',
            page: page || 1,
            maxPageSize
        })

        return { code: 200, response }
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = getReportedPosts