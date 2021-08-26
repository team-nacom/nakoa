import createHttpError from "http-errors";
import { Document, model, Schema } from "mongoose";
import { UserDocument } from "./user";

export interface GuideDocument extends Document {
    index: number,
    name: string, // change the name to title?
    authors: [string],
    content: string,
    isPublic: boolean,
    createDate: number,
    tags: [string],

    //TODO: Remove these
    cate: number,
    gory: string,
    priority: number,

    hasWriteAuthority: (user: UserDocument) => boolean,

}

const guideSchema = new Schema<GuideDocument>({
    index: { type: Number, index: true, unique: true },

    name: String,
    authors: [String],
    content: String,
    tags: [String],

    isPublic: { type: Boolean, default: false },
    cate: Number,
    gory: String,
    // 0 is least important, 4 is most important
    priority: { type: Number, default: 4, min: 0, max: 4},

    createDate: { type: Number, default: Date.now }
});

guideSchema.methods.hasWriteAuthority = function(user: UserDocument){
    if(!user) return false;
    if(!this.authors || this.authors.length != 1) throw createHttpError(500, "Error while checking authority");

    const isAdmin = (user.email === "nacommanager@gmail.com");
    const isAuthor = (user.nickname === this.authors[0]);
    return isAdmin || isAuthor;    
}

export default model<GuideDocument>('Guide', guideSchema, 'guides');