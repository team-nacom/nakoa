import { Document, model, Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { createHash } from "crypto";
import { baseid, sendMail } from "../utils";
import { SentMessageInfo } from "nodemailer";

export const givenOptions = { "usernameField": "email" };


export interface UserDocument extends Document {
    email: string,
    nickname: string,
    verified: boolean,
    verifyHash: string,

    joinDate: number,
    
    sendEmailVerification: () => Promise<UserDocument>,
    checkEmailVerification: (secret: string) => Promise<boolean>,
}

const userSchema = new Schema<UserDocument>({
    email: {type: String, unique: true, required: true, index: true},
    nickname: {type: String, unique: true, required: true},
    verified: {type: Boolean, default: false},
    verifyHash: String,

    joinDate: { type: Number, default: Date.now }
});

userSchema.plugin(passportLocalMongoose, givenOptions);

function getHash(secret: string): string {
    const hasher = createHash("sha256");
    hasher.update(secret);
    return hasher.digest("hex");
}

userSchema.methods.sendEmailVerification = async function(): Promise<SentMessageInfo> {
    const secret = baseid(32);
    this.verifyHash = getHash(secret);
    this.save();
    const msg = createMessage(this.email, secret);
    const info = await sendMail(this.email, subject, msg);
    return info;
}

userSchema.methods.checkEmailVerification = async function(secret: string): Promise<boolean>{
    return (this.verifyHash === getHash(secret));
}

export default model<UserDocument>('User', userSchema, 'users');

const subject = "Welcome to Team Wooden Compass!"

function createMessage(email: string, secret: string): string {
    const url = `https://team-na.com/user/verify/${email}/${secret}`;
    const nacomMail = 'nacommanager@gmail.com';
    let msg = 
        "Welcome to Team Wooden Compass!\n" + 
        `Here is your email verification link: ${url}\n` +
        "It expires in 24 hours.\n" +
        "\n" +
        `If it is not you, please contact ${nacomMail}\n` +
        "Sincerely, Team Wooden Compass Developers";
    return msg;
}

function createhtml(email: string, secret: string): string {
    // TODO add anchor tags
    const url = `https://team-na.com/user/verify/${email}/${secret}`;
    const nacomMail = 'nacommanager@gmail.com';
    let msg = 
        "<p>Welcome to Team Wooden Compass!\n" + 
        `Here is your email verification link: ${url}\n` +
        "It expires in 24 hours.\n" +
        "\n" +
        `If it is not you, please contact ${nacomMail}\n` +
        "Sincerely, Team Wooden Compass Developers</p>";
    return msg;
}