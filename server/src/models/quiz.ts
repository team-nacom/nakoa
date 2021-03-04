import { Document, model, Schema } from "mongoose";

export interface QuizType {
    index: number,
    name: string,
    description: string,
    choices: [string],
    answer: string, // correct answer (1-based index of the correct choice)
    explanation: string,
    createDate: number
};

type QuizDocument = QuizType & Document;

const quizSchema = new Schema<QuizDocument>({
    // _id: Number (default)
    index: Number,
    name: String,
    description: String,
    choices: [String],
    answer: String, // correct answer (1-based index of the correct choice)
    explanation: String,
    createDate: { type: Number, default: Date.now }
});

export default model<QuizDocument>('Quiz', quizSchema, 'quizzes');