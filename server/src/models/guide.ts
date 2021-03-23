import { Document, model, Schema } from "mongoose";

// Guide model
export interface GuideDocument extends Document {
    index: number,
    name: string, // change the name to title?
    content: string,
    authors: [string],
    priority: number,
    createDate: number,
    exercises: [object]
}

const guideSchema = new Schema<GuideDocument>({
    // _id: Number (default)
    index: Number,
    name: String,
    content: String,
    authors: [String],
    priority: Number, // 1 is highest, 5 is lowest
    createDate: { type: Number, default: Date.now },
    exercises: {
        type: [{
            title: String,
            content: String,
            answer: String
        }],
        default: []
    }
});

export default model<GuideDocument>('Guide', guideSchema, 'guides');