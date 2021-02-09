import { model, Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({});

userSchema.plugin(passportLocalMongoose);

export default model('User', userSchema, 'users');