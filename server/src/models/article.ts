import { Document, model, Schema, ObjectId } from 'mongoose';
import { baseid } from '../utils';

import { ArticleAttribute, ClassicArticle, BasicCellArticle } from '#common/Article';

const articleSchema = new Schema<ArticleAttribute>({
    localIndex: { type: String,
        // index: true,
        // unique: true,
        // default: () => baseid(8),
    },
    publicIndex: { type: String,
        index: true,
        unique: true,
        default: () => baseid(8),
    },
    // createDate,
    // updateDate,
    metadata: {
        title: String,
        author: String,
        tags: [String],
        visibility: Number
    },
    files: [Buffer],
    filePaths: [String],
}, {
    timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' },
    discriminatorKey: 'mode'
});

export const ArticleModel = model<ArticleAttribute>('Article', articleSchema, 'articles');


///// unused below

const classicArticleAttributeSchema = new Schema({
    text: String
});
export const ClassicArticleModel = ArticleModel.discriminator<ClassicArticle>('classic', classicArticleAttributeSchema);


const basicCellArticleAttributeSchema = new Schema({
    content: {
        rootId: String,
        cellData: { type: Map, of: Schema.Types.Mixed }, // should give more detail about CellType(or BasicCellType)?
        structData: { type: Map, of: [String] }
    }
});
export const BasicCellArticleModel = ArticleModel.discriminator<BasicCellArticle>('cell', basicCellArticleAttributeSchema);