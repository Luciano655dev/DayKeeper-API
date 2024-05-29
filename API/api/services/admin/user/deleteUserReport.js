const User = require('../../../models/User')
const {
    errors: { notFound },
    success: { deleted }
} = require('../../../../constants')

const deleteUserReport = async(props)=>{
    const { name: username, reportId } = props

    try{
        const updatedUser = await User.findOneAndUpdate({ name: username }, {
            $pull: {
                reports: { _id: reportId }
            }
        }, { new: true })

        if(!updatedUser)
            return notFound('User')

        return deleted(`Report`)
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = deleteUserReport