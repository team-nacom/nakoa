import { Document, model, Schema } from "mongoose";
import {baseid} from "../utils";

export interface BubbleDocument extends Document {
    index: string,
    content: string,
    createDate: number
}

const bubbleSchema = new Schema<BubbleDocument>({
    index: { type: String, index: true, unique: true, default: () => baseid(8) },
    content: String,
    createDate: { type: Number, default: Date.now }
});

export default model<BubbleDocument>('Bubble', bubbleSchema, 'bubbles');