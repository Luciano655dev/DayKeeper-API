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
        reaction,
        loggedUser
    } = props

    if (!reaction || reaction < 0 || reaction >= 5)
      return invalidValue(`reaction`)
  
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

        reactedStorie = reactedStorie.stories
    
        /* Verify if the user has reacted before */
        const existingReactionIndex = reactedStorie.reactions.findIndex(
            (reaction) => reaction.user == loggedUser._id
        )
    
        /* if exists */
        if (existingReactionIndex !== -1) {
            if (reactedStorie.reactions[existingReactionIndex].reaction === reaction) {
                /* If it's the same reaction, remove */
                reactedStorie.reactions.splice(existingReactionIndex, 1)
            } else {
                /* If it's a different reaction, update */
                reactedStorie.reactions[existingReactionIndex].reaction = reaction
            }
        } else {
            /* If dont exists, add new reaction */
            reactedStorie.reactions.push({ user: loggedUser._id, reaction })
        }

        await reactedStorie.save()
    
        return custom("The reaction was added or removed from the Storie", { storie: reactedStorie })
    } catch (error) {
        console.log(error)
      throw new Error(error.message)
    }
}

module.exports = reactStorie