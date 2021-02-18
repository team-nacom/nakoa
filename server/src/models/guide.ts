import { Document, model, Schema } from "mongoose";

export interface GuideDocument extends Document {
    index: number,
    name: string,
    content: string,
    priority: number,
    createDate: number
}

const guideSchema = new Schema<GuideDocument>({
    // _id: Number (default)
    index: Number,
    name: String,
    content: String,
    priority: Number, // 1 is highest, 5 is lowest
    createDate: { type: Number, default: Date.now }
});

export default model<GuideDocument>('Guide', guideSchema, 'guides');