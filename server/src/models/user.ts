import { Document, model, Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export const givenOptions = { "usernameField": "email" };


export interface UserDocumenet extends Document {
    email: string,
    nickname: string,
    password: string,
    authed: boolean
}

const userSchema = new Schema<UserDocumenet>({
    email: {type: String, unique: true, required: true, index: true},
    nickname: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    joinDate: { type: Number, default: Date.now }
});

userSchema.plugin(passportLocalMongoose, givenOptions);

export default model<UserDocumenet>('User', userSchema, 'users');