const getQuestion = require(`../services/dailyQuestion/getQuestion`)

const getQuestionController = async(req, res)=>{
    try{
        const { code, message, question } = await getQuestion(req.params)

        return res.status(code).json({ message, question })
    }catch(error){
        return res.status(500).json({ error })
    }
}

module.exports = {
    getQuestion: getQuestionController
}