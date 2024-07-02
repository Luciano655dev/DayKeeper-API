const Storie = require('../../../models/Storie')

const {
    errors: { notFound },
    success: { deleted }
} = require('../../../../constants/index')

const deleteStorieReport = async(props)=>{
    const {
        storieId,
        reportId
    } = props

    try{
        const updatedStorie = await Storie.findByIdAndUpdate(storieId, {
            $pull: {
                reports: { _id: reportId }
            }
        }, { new: true })

        if(!updatedStorie)
            return notFound('Storie')

        return deleted(`Report`, { storie: updatedStorie })
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = deleteStorieReport