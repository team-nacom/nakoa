import { Document, model, Schema } from "mongoose";
import { GoryDocument } from "./gory";

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

cateSchema.statics.onDeleteGory = async function (gory: GoryDocument) {
    const index = gory.cate;
    const result = await this.updateOne({index: index}, {$pull: {gories: gory.index}});

    const cate = await this.findOne({index});
    if(cate != null && (!("gories" in cate) || cate.gories.length == 0)) {
        await this.deleteOne({index});
    }
}

export default model<CateDocument>('Cate', cateSchema, 'cates');