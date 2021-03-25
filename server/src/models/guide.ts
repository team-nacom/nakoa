import { Document, model, Schema } from "mongoose";

export interface GuideDocument extends Document {
    index: number,
    name: string, // change the name to title?
    authors: [string],
    content: string,
    category: string,
    section: string,
    priority: number,
    createDate: number
}

const guideSchema = new Schema<GuideDocument>({
    index: { type: Number, index: true, unique: true },
    name: String,
    authors: [String],
    content: String,
    category: String,
    section: String,
    priority: Number, // 1 is highest, 5 is lowest
    createDate: { type: Number, default: Date.now }
});

export default model<GuideDocument>('Guide', guideSchema, 'guides');