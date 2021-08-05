import { Document, model, Schema } from "mongoose";
import { baseid } from '../utils'

export interface GoryDocument extends Document {
    index: string
    name: string

    cate: number,
    guides: [number]

    createDate: number
}

const GorySchema = new Schema<GoryDocument>({
    index: { type: String, index: true, unique: true, default: () => baseid(8) },
    name: String,

    cate: Number,
    guides: [Number],

    createDate: { type: Number, default: Date.now }
});

export default model<GoryDocument>('Gory', GorySchema, 'gories');