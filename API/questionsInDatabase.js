const mongoose = require('mongoose');
const fs = require('fs').promises; // Use the promisified version of fs

const questionSchema = new mongoose.Schema({
    day: String,
    data: String
});

const Question = mongoose.model('Question', questionSchema, 'questions');

const readAndSaveQuestions = async () => {
    try {
        const data = await fs.readFile('./dailyQuestions.json', 'utf8');
        const jsonData = JSON.parse(data);
        const questions = jsonData.questions;

        // Loop through each question and save it to the database
        for (let i = 0; i < questions.length; i++) {
            const newQuestion = new Question({
                day: questions[i].day,
                data: questions[i].question // Assuming 'question' is the key in the JSON for the question
            });

            try {
                await newQuestion.save();
                console.log(`Questão ${i + 1} salva com sucesso!`);
            } catch (err) {
                console.error(`Erro ao salvar a questão ${i + 1}`, err);
            }
        }
    } catch (err) {
        console.error("Erro ao ler o arquivo ou parsear o JSON", err);
    }
};

// Connect to MongoDB and call the readAndSaveQuestions function
mongoose.connect(`mongodb+srv://Luciano655:LuciaNo50135@Cluster0.iyslifi.mongodb.net/?retryWrites=true&w=majority`)
.then(() => {
    console.log('\x1b[36mBanco de dados conectado\x1b[0m')
    readAndSaveQuestions()
})
.catch(err => console.log(err))
