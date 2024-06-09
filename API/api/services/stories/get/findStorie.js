const Storie = require(`../../../models/Storie`)
const findUser = require(`../../user/get/findUser`)
const mongoose = require(`mongoose`)
const {
    hideUserData,
    hideStorieData,
    hideGeneralData
} = require(`../../../repositories/index`)

const {
    errors: { notFound },
    success: { fetched }
} = require(`../../../../constants`)

const findStorie = async({ userInput, storieInput, fieldsToPopulate = [], loggedUserId })=>{
    try{
        // find user
        let storieUser = findUser(userInput)
        if(!storieUser)
            return notFound(`User`)

        // find storie
        const populateOptions = fieldsToPopulate.map(field => ({
            path: field,
            match: { banned: { $ne: true } },
            select: hideUserData
        }))

        const project = storieUser._id == loggedUserId ? hideGeneralData : {
            ...hideStorieData,
            ...hideGeneralData
        }
        
        let stories = await Storie.find(
            { title: storieInput, user: storieUser._id },
            project
        ).populate(populateOptions)
        if(!stories?.length && mongoose.Types.ObjectId.isValid(storieInput))
            stories = await Storie.findById(storieInput, project).populate(populateOptions)

        if(!stories)
            return notFound(`Stories`)

        return fetched(`Stories`, { stories })
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = findStorie