const User = require(`../../../models/User`)
const Storie = require(`../../../models/Storie`)
const mongoose = require(`mongoose`)

const { sendStorieBanEmail, sendStorieUnbanEmail } = require(`../../../utils/emailHandler`)
const {
    admin: { maxReportMessageLength },
    errors: { inputTooLong, notFound, invalidValue },
    success: { custom }
} = require(`../../../../constants/index`)

const banOrUnbanStorie = async(props)=>{
    const {
        storieId,
        reason,
        loggedUser
    } = props

    if(reason.length > maxReportMessageLength)
        return inputTooLong(`Message`)

    try {
        if(!mongoose.Types.ObjectId.isValid(storieId))
            return invalidValue(`Storie ID`)

        const deletedStorie = await Storie.findById(storieId).populate(`user`)
        if(!deletedStorie) return notFound(`Storie`)

        if(deletedStorie.banned == "true"){
            await Storie.updateOne({ _id: storieId },
                {
                    $set: {
                        banned: false,
                        "ban_history.$[elem].unban_date": Date.now(),
                        "ban_history.$[elem].unbanned_by": loggedUser._id,
                        "ban_history.$[elem].unban_message": reason
                    }
                },
                {
                    arrayFilters: [{ "elem.unban_date": { $exists: false } }]
                }
            )

            await sendStorieUnbanEmail({
                username: deletedStorie.user.name,
                email: deletedStorie.user.email,
                title: deletedStorie.title,
                id: deletedStorie._id,
                adminUsername: loggedUser.name,
                reason
            })

            return custom( `${deletedStorie.user.name}'s Storie from ${deletedStorie.title} with the id "${deletedStorie._id}" unbanned successfully` )
        }

        await Storie.updateOne({ _id: storieId }, {
            $set: {
                banned: true,
            },
            $push: {
                ban_history: {
                    banned_by: loggedUser._id,
                    ban_date: Date.now(),
                    ban_message: reason
                }
            }
        })

        await sendStorieBanEmail({
            username: deletedStorie.user.name,
            email: deletedStorie.user.email,
            title: deletedStorie.title,
            id: deletedStorie._id,
            adminUsername: loggedUser.name,
            reason
        })
        
        return custom(`${deletedStorie.user.name}'s Storie from ${deletedStorie.title} banned successfully`)
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = banOrUnbanStorie