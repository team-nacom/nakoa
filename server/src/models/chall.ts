import { model, Schema } from "mongoose";

const challSchema = new Schema({
    // _id: Number (default)
    index: Number,
    name: String,

    solveCount: { type: Number, default: 0 },
    problemUrl: String,
    solutionUrl: String,
    problemOpenDate: { type: Number, default: () => Date.now() + 86400 },
    solutionOpenDate: { type: Number, default: () => Date.now() + 86400 },
    isPublic: { type: Boolean, default: false },
    createDate: { type: Number, default: Date.now },
});

export default model('Chall', challSchema, 'challs');