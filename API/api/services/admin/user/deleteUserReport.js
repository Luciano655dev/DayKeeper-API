const User = require('../../../models/User')
const { notFound } = require('../../../../constants')

const deleteUserReport = async(props)=>{
    const { name: username, reportId } = props

    try{
        const updatedUser = await User.findOneAndUpdate({ name: username }, {
            $pull: {
                reports: { _id: reportId }
            }
        }, { new: true })

        if(!updatedUser)
            return { code: 404, message: notFound('User') }

        return {
            code: 200,
            message: "Report deleted successfully",
            user: updatedUser
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = deleteUserReport