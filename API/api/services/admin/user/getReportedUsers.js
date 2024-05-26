const getDataWithPages = require('../../getDataWithPages')
const { reportedElementPipeline } = require('../../../repositories')

const getReportedUsers = async(props)=>{
    const { page, maxPageSize } = props

    try{
        const response = await getDataWithPages({
            type: 'User',
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

module.exports = getReportedUsers