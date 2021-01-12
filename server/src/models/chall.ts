import { model, Schema } from "mongoose";

const challSchema = new Schema({
    // _id: Number (default)
    index: Number,
    name: String,

    solveCount: Number,
    problemUrl: String,
    solutionUrl: String,
    problemOpenDate: { type: Date, default: () => Date.now() + 86400 },
    solutionOpenDate: { type: Date, default: () => Date.now() + 86400 },
    isPublic: { type: Boolean, default: false },
    createDate: { type: Date, default: Date.now },
});

// challSchema.methods.getStatemetPdfLocation

export default model('Chall', challSchema, 'challs');