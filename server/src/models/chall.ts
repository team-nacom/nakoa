import { model, Schema } from "mongoose";

const challSchema = new Schema({
    index: Number,
    name: String,
    createDate: { type: Date, default: Date.now }
});

export default model('Chall', challSchema);