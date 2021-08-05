import { Document, model, Schema } from "mongoose";

export interface CateDocument extends Document {
    index: number
    name: string

    gories: [string]

    createDate: number
}

const cateSchema = new Schema<CateDocument>({
    index: { type: Number, index: true, unique: true },
    name: String,
    
    gories: { type: [String], default: [] },

    createDate: { type: Number, default: Date.now }
});

export default model<CateDocument>('Cate', cateSchema, 'cates');