const findStorie = require(`./get/findStorie`)

const getStorie = async(props)=>{
    const {
        name: userInput,
        storieTitle: storieInput,
        populate,
        loggedUser
    } = props

    let populateFields = populate ? populate.split(',') : []

    try{
        const response = findStorie({
            userInput,
            storieInput,
            fieldsToPopulate: populateFields,
            loggedUserId: loggedUser._id,
            view: true
        })

        return response
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = getStorie