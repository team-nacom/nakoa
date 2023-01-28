import { Document, model, Schema } from 'mongoose';
import { baseid } from '../utils';

import { ArticleAttribute, ClassicArticle, BasicCellArticle } from '#common/Article';

const articleSchema = new Schema<ArticleAttribute>({
    index: { type: String, // IdxType
        index: true, unique: true, default: () => baseid(8),
    },
    // createDate,
    // updateDate,
    metadata: {
        title: String,
        author: String,
        tags: [String],
        visibility: Number
    }
}, {
    timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' },
    discriminatorKey: 'mode'
});

export const ArticleModel = model<ArticleAttribute>('Article', articleSchema, 'articles');


const classicArticleAttributeSchema = new Schema({
    text: String
});
export const ClassicArticleModel = ArticleModel.discriminator<ClassicArticle>('classic', classicArticleAttributeSchema);


const basicCellArticleAttributeSchema = new Schema({
    rootId: String,
    cellData: { type: Map, of: Schema.Types.Mixed }, // should give more detail about CellType(or BasicCellType)?
    structData: { type: Map, of: [String] }
});
export const BasicCellArticleModel = ArticleModel.discriminator<BasicCellArticle>('cell', basicCellArticleAttributeSchema);



// export interface Article extends Document {
//   index: string,
//   title: string,
//   author: string,
//   content: string,
//   hidden: boolean,
//   createDate: number
// }

// const flatSchema = new Schema<FlatDocument>({
//   index: {
//     type: String, index: true, unique: true, default: () => baseid(8),
//   },
//   title: String,
//   author: String,
//   content: String,
//   hidden: { type: Boolean, default: false },
//   createDate: { type: Number, default: Date.now },
// });

// export default model<FlatDocument>('Flat', flatSchema, 'flats');
