import { Document, model, Schema } from "mongoose";
import { baseid } from '../utils'
import { GuideDocument } from "./guide";
import Cate from './cate';

export interface GoryDocument extends Document {
    index: string
    name: string

    cate: number,
//    guides: [number]

    createDate: number
}

const GorySchema = new Schema<GoryDocument>({
    index: { type: String, index: true, unique: true, default: () => baseid(8) },
    name: String,

    cate: Number,
//    guides: [Number],

    createDate: { type: Number, default: Date.now }
});

/*GorySchema.statics.onDeleteGuide = async function (doc: GuideDocument) {
    const index = doc.gory;
    const result = await this.updateOne({index: index}, {$pull: {guides: doc.index}});

    const gory = await this.findOne({index});
    if(gory != null && (!("guides" in gory) || gory.guides.length == 0)) {
        await this.deleteOne({index});
        // @ts-ignore
        await Cate.onDeleteGory(gory);
    }
}*/

export default model<GoryDocument>('Gory', GorySchema, 'gories');