import { Document, model, Schema } from 'mongoose';
import { baseid } from '../utils';

export interface FlatDocument extends Document {
  index: string,
  title: string,
  author: string,
  content: string,
  hidden: boolean,
  createDate: number
}

const flatSchema = new Schema<FlatDocument>({
  index: {
    type: String, index: true, unique: true, default: () => baseid(8),
  },
  title: String,
  author: String,
  content: String,
  hidden: { type: Boolean, default: false },
  createDate: { type: Number, default: Date.now },
});

export default model<FlatDocument>('Flat', flatSchema, 'flats');
