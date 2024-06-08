const {
    success: { custom }
} = require('../../../constants')

const reactStorie = async(props)=>{
    try{
        return custom("REACT TO A STORIE HERE")
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = reactStorie