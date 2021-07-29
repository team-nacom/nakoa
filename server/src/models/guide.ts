import { Document, model, Schema } from "mongoose";

export interface GuideDocument extends Document {
    index: number,

    name: string, // change the name to title?
    authors: [string],
    content: string,
    
    isPublic: boolean,
    cate: number,
    gory: string,
    priority: number,

    createDate: number
}

const guideSchema = new Schema<GuideDocument>({
    index: { type: Number, index: true, unique: true },

    name: String,
    authors: [String],
    content: String,

    isPublic: { type: Boolean, default: false },
    cate: Number,
    gory: String,
    // 0 is least important, 4 is most important
    priority: { type: Number, default: 4, min: 0, max: 4},

    createDate: { type: Number, default: Date.now }
});

export default model<GuideDocument>('Guide', guideSchema, 'guides');