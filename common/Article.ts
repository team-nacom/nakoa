import { BasicCell } from './BasicCell';

/**
 * metadata which is editable by user.
 */
export interface Metadata {
    title: string;
    author: string; // author: string | string[]; // TODO
    tags?: string[];
    visibility?: number;
    // visibility 2 : public
    // visibility 1 : secret (unlisted)
    // visibility 0 : private

    // NOTE : 복원 전에는 isProfile 필드가 있었는데, 그냥 사용자 레코드에 article id를 추가하는 걸로 하고, 글 검색 시에는 visibility를 사용하는 것으로 상정해서 이렇게 했습니다.
    // visibility가 전순서가 아니게 되면(e.g. 'internal') 그 때 string으로 바꾸면 될듯
};

/**
 * contains metadata and auto-generated attributes
 */
export interface ArticleAttribute {
    localIndex?: string; // 해당 사용자가 로컬에서 사용하는 index. publishing 과정에서는 token으로 사용한다. published된 글의 localIndex는 FE에 제공되지 않는다.

    publicIndex?: string; // published된 글을 구분할 때 사용하는 index.

    // fork 시에는 publicIndex만 전달되고, localIndex는 로컬에서 자동 생성된다.
    // publish 시에는 우선 일치하는 publicIndex의 글을 찾는다.
    // * 만약 publicIndex와 localIndex가 모두 일치하면 글이 수정이 된다.
    // * 만약 publicIndex만 같고(p0) localIndex가 다르다면(서버: l0, 요청: l1), 새로운 publicIndex(p1)를 생성해서 publicIndex p1, localIndex l1인 새로운 글을 publish한다
    //   이 때 클라이언트의 publicIndex도 p1로 수정된다. ( todo: 이 과정을 4-way handshake처럼 해서 transaction 처리해야 되나?? )
    //   DB의 어딘가에(혹은 article의 새로운 필드로?) p1 글이 p0 글을 fork했다는 정보로서 p0 -> p1 링크를 저장한다.

    // 보안문제가 있을까?

    createDate?: Date;
    updateDate?: Date;
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