import { Document, model, Schema, Model } from "mongoose";

export interface CountDocument extends Document {
    name: string,
    next: number,
    nextCount: () => Promise<Number>,
    resetCount: () => Promise<void>
}

interface CounterModel extends Model<CountDocument> {
    getNextCount: (name: string) => Promise<Number>,
    resetCount: (name: string) => Promise<void>
}


const countSchema = new Schema<CountDocument>({
    name: { type: String, required: true, unique: true },
    next: { type: Number, default: 1 } // maximum index of the collection
});

countSchema.statics.getNextCount = function(name: string): Promise<Number>{
    // return a Promise which increments this.next and returns it
    // findOneAndUpdate returns a document before updating
    return this.findOneAndUpdate({ name: name }, { $inc: { next: 1 }}).exec()
        .then((doc: CountDocument) => { if(doc==null) throw new Error("Such counter does not exist"); return doc; })
        .then((doc: CountDocument) => doc.next);
}

countSchema.statics.resetCount = function(name: string): Promise<void>{
    // return a Promise which resets this.next
    return this.findOneAndUpdate({ name: name }, { next: 1 }).exec()
        .then((doc: CountDocument) => { if(doc==null) throw new Error("Such counter does not exist"); });
}


const Count: CounterModel = model<CountDocument, CounterModel>('Count', countSchema, 'counts');
export default Count;

