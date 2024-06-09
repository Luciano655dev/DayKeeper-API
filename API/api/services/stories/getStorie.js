const findUser = require(`../user/get/findUser`)
const findStorie = require(`./get/findStorie`)

const getStorie = async(props)=>{
    const {
        name: userInput,
        storieTitle: storieInput,
        populate
    } = props

    let populateFields = populate ? populate.split(',') : []

    try{
        const response = findStorie({
            userInput,
            storieInput,
            fieldsToPopulate: populateFields,
        })

        return response
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = getStorie