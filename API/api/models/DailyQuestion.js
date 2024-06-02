const mongoose = require('mongoose')

const dailyQuestionSchema = mongoose.Schema({
    day: String,
    data: String
})

const DailyQuestion = mongoose.model('DailyQuestion', dailyQuestionSchema, 'questions')

module.exports = DailyQuestion