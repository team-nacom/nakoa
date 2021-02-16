import { model, Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export const givenOptions = { "usernameField": "email" };
const userSchema = new Schema({
    nickname: String,
    joinDate: { type: Number, default: Date.now }
});

userSchema.plugin(passportLocalMongoose, givenOptions);

export default model('User', userSchema, 'users');