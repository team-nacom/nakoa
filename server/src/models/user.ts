import { Document, model, Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { createHash } from "crypto";
import { baseid } from "../utils";

export const givenOptions = { "usernameField": "email" };


export interface UserDocumenet extends Document {
    email: string,
    nickname: string,
    password: string,
    verified: boolean,
    hash: string,
    sendEmailVerification: () => Promise<UserDocumenet>,
    checkEmailVerification: (secret: string) => Promise<boolean>,

    joinDate: number
}

const userSchema = new Schema<UserDocumenet>({
    email: {type: String, unique: true, required: true, index: true},
    nickname: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    verified: {type: Boolean, default: false},
    hash: String,

    joinDate: { type: Number, default: Date.now }
});

userSchema.plugin(passportLocalMongoose, givenOptions);

function getHash(secret: string): string {
    const hasher = createHash("sha256");
    hasher.update(secret);
    return hasher.digest("hex");
}

userSchema.methods.sendEmailVerification = async function(): Promise<UserDocumenet> {
    const secret = baseid(32);
    this.hash = getHash(secret);
    // send url
    return this;
}

userSchema.methods.checkEmailVerification = async function(secret: string): Promise<boolean>{
    return (this.hash == getHash(secret));
}

export default model<UserDocumenet>('User', userSchema, 'users');