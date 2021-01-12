import { model, Schema } from "mongoose";

const quizSchema = new Schema({
    // _id: Number (default)
    index: Number,
    name: String,
    description: String,
    choices: [String],
    answer: String, // correct answer (1-based index of the correct choice)
    explanation: String,
    createDate: { type: Number, default: Date.now }
});

export default model('Quiz', quizSchema, 'quizzes');