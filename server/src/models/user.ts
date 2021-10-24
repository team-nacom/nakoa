import { Document, model, Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { createHash } from "crypto";
import { baseid, sendMail } from "../utils";
import Guides from "./guide";

import { SentMessageInfo } from "nodemailer";

export const givenOptions = { "usernameField": "email" };


export interface UserDocument extends Document {
    email: string,
    nickname: string,
    verified: boolean,
    verifyHash: string,
    guides: [Schema.Types.ObjectId],
    joinDate: number,

    bio: string,
    website: string,
    affiliation: string,
    
    sendEmailVerification: () => Promise<UserDocument>,
    checkEmailVerification: (secret: string) => Promise<boolean>,
}

const userSchema = new Schema<UserDocument>({
    email: {type: String, unique: true, required: true, index: true},
    nickname: {type: String, unique: true, required: true},
    verified: {type: Boolean, default: false},
    verifyHash: String,
    
    guides: [{ type: Schema.Types.ObjectId, ref: 'Guide' }],

    joinDate: { type: Number, default: Date.now },

    bio: String,
    website: String,
    affiliation: String,
});

//@ts-ignore
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

// userSchema.methods.getTagList = async function(): Promise<Array<string>>{
//     await this.guides
//         .map(async (id) => await (Guides.findById(id).then((guide) => guide!.tags)))
//         .reduce((result, value) => result.concat(value))
//         .filter()
// }

export default model<UserDocument>('User', userSchema, 'users');

const subject = "Welcome to Team Wooden Compass!"
const nacomUrl = process.env.CLIENT_URL ?? "localhost:3000";

function createMessage(email: string, secret: string): string {
    const url = `${nacomUrl}/signup/verify/${email}/${secret}`;
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
    const url = `${nacomUrl}/signup/verify/${email}/${secret}`;
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