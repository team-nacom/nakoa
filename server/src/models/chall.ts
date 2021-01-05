import { model, Schema } from "mongoose";

const challSchema = new Schema({
    // _id: Number (default)
    index: Number,
    name: String,
    isPublic: { type: Boolean, default: false },
    createDate: { type: Date, default: Date.now }
});

// challSchema.methods.getStatemetPdfLocation

export default model('Chall', challSchema, 'challs');