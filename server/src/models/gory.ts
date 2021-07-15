import { Document, model, Schema } from "mongoose";

export interface GoryDocument extends Document {
    index: string
    name: string

    cate: number,
    guides: [string]

    createDate: number
}

const GorySchema = new Schema<GoryDocument>({
    index: { type: String, index: true, unique: true },
    name: String,

    cate: Number,
    guides: [String],

    createDate: { type: Number, default: Date.now }
});

export default model<GoryDocument>('Gory', GorySchema, 'Gories');