import { BasicCell } from './BasicCell';

/**
 * metadata which is editable by user.
 */
export interface Metadata {
    title: string;
    author: string | string[];
    tags?: string[];
    visibility?: number;
    // visibility 2 : public
    // visibility 1 : secret (unlisted)
    // visibility 0 : private

    // NOTE : 복원 전에는 isProfile 필드가 있었는데, 그냥 사용자 레코드에 article id를 추가하는 걸로 하고, 글 검색 시에는 visibility를 사용하는 것으로 상정해서 이렇게 했습니다.
    // visibility가 전순서가 아니게 되면(e.g. 'internal') 그 때 string으로 바꾸면 될듯
};

export type IdxType = string;
export function toIdx(idxString: string): IdxType{ return idxString; }

/**
 * contains metadata and auto-generated attributes
 */
export interface ArticleAttribute {
    index?: IdxType;
    createDate?: Date;
    metadata: Metadata;
};

export interface ClassicArticle extends ArticleAttribute {
    mode: 'classic';
    text: string;
};

export interface CellArticleContent<C extends BasicCell = BasicCell>{
    rootId: string,
    cellData: Record<string, C>,
    structData: Record<string, string[]>
};

export interface BasicCellArticle<C extends BasicCell = BasicCell> extends ArticleAttribute {
    mode: 'cell';
    content: CellArticleContent<C>;
};

// export type Article = ClassicArticle | BasicCellArticle;

// should be redefined as ClassicArticle | BasicCellArticle<Cell> once Cell type has been declared.

// to read:
// https://mongoosejs.com/docs/discriminators.html