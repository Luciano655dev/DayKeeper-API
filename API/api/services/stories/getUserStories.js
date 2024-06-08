const {
    success: { custom }
} = require('../../../constants')

const getUserStories = async(props)=>{
    try{
        return custom("GET USER STORIES HERE")
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = getUserStories