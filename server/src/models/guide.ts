import createHttpError from "http-errors";
import { Document, model, Schema } from "mongoose";

export interface GuideDocument extends Document {
    index: number,
    name: string, // change the name to title?
    authors: [string],
    isProfile: boolean,
    content: string,
    isPublic: boolean,
    createDate: number,
    tags: [string],
    writer: Schema.Types.ObjectId,
    
    updateDate: number,
}

const guideSchema = new Schema<GuideDocument>({
    index: { type: Number, index: true, unique: true },

    name: String,
    authors: [String],
    content: String,
    tags: [String],
    isProfile: Boolean,
    writer: { type: Schema.Types.ObjectId, ref: 'User' },

    isPublic: { type: Boolean, default: false },
    //cate: Number,
    //gory: String,
    // 0 is least important, 4 is most important
    //priority: { type: Number, default: 4, min: 0, max: 4},

    createDate: { type: Number, default: Date.now },
    updateDate: { type: Number, default: Date.now }
});

export default model<GuideDocument>('Guide', guideSchema, 'guides');