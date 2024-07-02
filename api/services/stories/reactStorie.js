const findStorie = require('./get/findStorie')
const mongoose = require(`mongoose`)

const {
    errors: { invalidValue, notFound },
    success: { custom }
} = require('../../../constants/index')

const reactStorie = async (props) => {
    const {
        name: username,
        storieTitle: storieInput,
        loggedUser
    } = props
  
    try {
        if(!mongoose.Types.ObjectId.isValid(storieInput))
            return invalidValue(`Storie ID`)

        let reactedStorie = await findStorie({
            userInput: username,
            storieInput,
            fieldsToPopulate: [`user`],
            loggedUserId: loggedUser._id,
            view: true
        })
        if(reactStorie?.stories == `undefined`)
            return notFound(`Storie`)

        storie = reactedStorie.stories

        const userLikeIndex = storie.likes.indexOf(loggedUser._id)

        if (userLikeIndex > -1) // add like
            storie.likes.splice(userLikeIndex, 1)
        else // remove like
            storie.likes.push(loggedUser._id)

        await reactedStorie.save()
    
        return custom("The like was added or removed from the Storie", { storie: reactedStorie })
    } catch (error) {
        console.log(error)
      throw new Error(error.message)
    }
}

module.exports = reactStorie