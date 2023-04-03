/// This code file is deprecated. use `article-local-idb.ts` instead.

import { base64rand } from '#/misc/base64rand';
import get from '#/config/db-rxdb';

import type { Article } from '#/components/cell-editor/types';

const dummyIndex = (s: string | undefined) => {
    if(s === undefined) throw new Error();
    return `&${s}`;
}

export async function unsetDraftArticle(localIndex?: string, mode?: Article['mode']){
    const { Draft } = await get();

    // the RxDB query API is different from mongodb and compatible with PouchDB. (namely, mango query syntax)
    // see https://rxdb.info/rx-query.html#examples for details.

    try{
        localIndex ??= dummyIndex(mode);

        await Draft.findOne({ selector: { localIndex }}).remove();

        return { success: true };
    } catch(err){
        return { success: false };
    }
}

export async function setDraftArticle(article: Article, localIndex?: string){
    const { Draft } = await get();

    try{
        localIndex ??= article.localIndex ?? dummyIndex(article.mode);
        await Draft.upsert({...article, localIndex});

        return { success: true };
    } catch(err){
        return { success: false };
    }
}

export async function getDraftArticle(localIndex?: string, mode?: Article['mode']){
    const { Draft } = await get();

    try{
        localIndex ??= dummyIndex(mode);
        const article: Article = (
            await Draft.findOne({ selector: { localIndex }}).exec()
        ).toMutableJSON();

        if(article.localIndex === dummyIndex(article.mode)){
            delete article.localIndex;
        }

        return article;
    } catch(err){
        return undefined;
    }
}

export async function getLocalArticleList(){
    const { Article } = await get();

    const articles: Article[] = await Article.find().exec();
    // these entries are not actually Articles but Rx Document Constructors.
    // we won't directly modify the articles, so this should be safe

    return articles;
}

export async function getLocalArticle(localIndex: string){
    const { Article } = await get();

    try{
        const article: Article = (
            await Article.findOne({ selector: { localIndex }}).exec()
        ).toMutableJSON();
        return article;
    } catch(err){
        return undefined;
    }
}

export async function getLocalArticleWithPublicIndex(publicIndex: string){
    const { Article } = await get();

    try{
        const article: Article = (
            await Article.findOne({ selector: { publicIndex }}).exec()
        ).toMutableJSON();
        return article;
    } catch(err){
        return undefined;
    }
}

async function generateUniqueIdx(){
    let localIndex = '';
    let article: Article | undefined;
    do{
        localIndex = base64rand(8);
        article = await getLocalArticle(localIndex);
    } while( article !== undefined );

    // when loop is over, we have safe localIndex

    return localIndex;
}

export async function postLocalArticle(article: Article, removeDraft: boolean = true){
    const { Article } = await get();

    // article.createDate = article.updateDate = new Date().toISOString();
    // while(true){
    //     try{
    //         let localIndex = base64rand(8);
    //         article.localIndex = localIndex;

    //         await Article.insert(article);

    //         return { success: true, localIndex };
    //     } catch(err){ }
    // }

    let localIndex = await generateUniqueIdx();
    article.localIndex = localIndex;
    article.createDate = article.updateDate = new Date();
    
    try{
        await Article.upsert(article);

        if(removeDraft){
            await unsetDraftArticle(undefined, article.mode);
        }

        return { success: true, localIndex };
    } catch(err){
        return { success: false };
    }
}

export async function updateLocalArticle(localIndex: string, article: Article, shouldUpdateDate: boolean = true){
    const { Article } = await get();

    article.localIndex = localIndex; // article argument might not have this localIndex anymore
    if(shouldUpdateDate){
        article.updateDate = new Date();
    }

    await Article.upsert(article);
    return { success: true };
}

export async function removeLocalArticle(localIndex: string){
    const { Article } = await get();
    
    await Article.findOne({ selector: { localIndex }}).remove();
    return { success: true };
}