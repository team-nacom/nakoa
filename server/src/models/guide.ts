import { model, Schema } from "mongoose";

const guideSchema = new Schema({
    // _id: Number (default)
    index: Number,
    name: String,
    content: String,
    priority: Number, // 1 is highest, 5 is lowest
    createDate: { type: Number, default: Date.now }
});

export default model('Guide', guideSchema, 'guides');