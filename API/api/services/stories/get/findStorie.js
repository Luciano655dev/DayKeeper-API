const Storie = require(`../../../models/Storie`)
const findUser = require(`../../user/get/findUser`)
const mongoose = require(`mongoose`)
const populateOptions = require(`../../../utils/populateOptions`)
const {
    hideStorieData,
    hideGeneralData
} = require(`../../../repositories/index`)

const {
    errors: { notFound },
    success: { fetched }
} = require(`../../../../constants`)

const findStorie = async({ userInput, storieInput, fieldsToPopulate = [], loggedUserId, view = false })=>{
    try{
        // find user
        let storieUser = await findUser(userInput)
        if(!storieUser)
            return notFound(`User`)

        // find storie
        const pO = populateOptions(fieldsToPopulate)
        const project = storieUser._id == loggedUserId ? hideGeneralData : {
            ...hideStorieData,
            ...hideGeneralData
        }
        const viewPipe = view ? { $addToSet: { views: loggedUserId } } : { }

        let stories
        if(mongoose.Types.ObjectId.isValid(storieInput))
            stories = await Storie.findOneAndUpdate(
                { _id: storieInput },
                viewPipe,
                { new: true, fields: project }
            ).populate(pO)
        else{
            await Storie.updateMany(
                { title: storieInput, user: storieUser._id },
                viewPipe
            )

            stories = await Storie.find(
                { title: storieInput, user: storieUser._id },
                project
            ).populate(pO)
        }

        if(!stories)
            return notFound(`Stories`)

        return fetched(`Stories`, { stories })
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = findStorie