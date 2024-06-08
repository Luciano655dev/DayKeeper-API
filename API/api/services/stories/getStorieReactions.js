const {
    success: { custom }
} = require('../../../constants')

const getStorieReactions = async(props)=>{
    try{
        return custom("GET STORIE REACTIONS HERE")
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = getStorieReactions