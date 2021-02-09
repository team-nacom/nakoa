import { model, Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const givenOptions = {};
const userSchema = new Schema(givenOptions);

userSchema.plugin(passportLocalMongoose);

export default model('User', userSchema, 'users');