import { Document, model, Schema } from "mongoose";
import { customAlphabet } from 'nanoid'

// base64+1
const nanoid = customAlphabet('AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789-_=', 8);

export interface GoryDocument extends Document {
    index: string
    name: string

    cate: number,
    guides: [number]

    createDate: number
}

const GorySchema = new Schema<GoryDocument>({
    index: { type: String, index: true, unique: true, default: () => nanoid() },
    name: String,

    cate: Number,
    guides: [Number],

    createDate: { type: Number, default: Date.now }
});

export default model<GoryDocument>('Gory', GorySchema, 'gories');