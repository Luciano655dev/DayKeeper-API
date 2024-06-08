const {
    success: { custom }
} = require('../../../constants')

const reportStorie = async(props)=>{
    try{
        return custom("REPORT STORIE HERE")
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = reportStorie