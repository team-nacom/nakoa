import { Document, model, Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export const givenOptions = { "usernameField": "email" };


export interface UserDocumenet extends Document {
    email: string,
    nickname: string,
    password: string
}

const userSchema = new Schema<UserDocumenet>({
    nickname: String,
    joinDate: { type: Number, default: Date.now }
});

userSchema.plugin(passportLocalMongoose, givenOptions);

export default model<UserDocumenet>('User', userSchema, 'users');