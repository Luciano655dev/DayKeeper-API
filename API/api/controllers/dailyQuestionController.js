require('dotenv').config()
const dailyQuestionsJson = require('../../dailyQuestions.json')
const bf = require('better-format')

const getQuestion = async(req, res)=>{
    const { date } = req.params

    try{
        const dateRegexFormat = /^\d{2}-\d{2}-\d{4}/

        if(!dateRegexFormat.test(date))
            return res.status(400).json({ message: "Enter a valid date" })
    
        const questionDay = date.split('-')[0]
        const questionMonth = date.split('-')[1]
        const questionYear = date.split('-')[2]

        const resetTime = process.env.RESET_TIME
        let todayDate = bf.FormatDate(Date.now())
        if(todayDate.hour < resetTime) todayDate.day -= 1

        const newDateToday = new Date(todayDate.year, todayDate.month-1, todayDate.day)
        const newDateSearched = new Date(questionYear, questionMonth-1, questionDay)

        let question = dailyQuestionsJson.questions.filter( el => el.day == `${questionDay}-${questionMonth}` )[0]

        if(newDateSearched > newDateToday)
            question = dailyQuestionsJson.questions.filter( el => el.day == `${questionDay-1}-${questionMonth}` )[0]

        if(!question) return res.status(404).json({ message: "Question not found" })
    
        return res.status(200).json(question)
    }catch(error){
        return res.status(500).json({
            message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        })
    }
}

module.exports = {
    getQuestion
}