import { Document, model, Schema } from 'mongoose';
import { baseid } from '../utils';

export interface BubbleDocument extends Document {
  index: string,
  title: string,
  author: string,
  content: string,
  tags: string[],
  hidden: boolean,
  createDate: number
}

const bubbleSchema = new Schema<BubbleDocument>({
  index: {
    type: String, index: true, unique: true, default: () => baseid(8),
  },
  title: String,
  author: String,
  content: String,
  tags: [String],
  hidden: { type: Boolean, default: false },
  createDate: { type: Number, default: Date.now },
});

export default model<BubbleDocument>('Bubble', bubbleSchema, 'bubbles');
