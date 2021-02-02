import { model, Schema } from "mongoose";

const userSchema = new Schema({
    // _id: Number (default)
    name: String,
    password: String,
    joinDate: { type: Number, default: Date.now }
});

export default model('User', userSchema, 'users');