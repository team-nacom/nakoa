import { dummyIndex } from '#/misc/dummyIndex';
import { base64rand } from '#/misc/base64rand';
import getDB from '#/config/db-idb';

import { PAGE_SIZE } from '#/common/consts';

import type { Article } from '#/components/cell-editor/types';

export async function unsetDraftArticle(localIndex?: string, mode?: Article['mode']){
    const db = await getDB();

    try{
        localIndex ??= dummyIndex(mode);
        await db.delete('drafts', localIndex);

        return { success: true };
    } catch(err){
        return { success: false };
    }
}

export async function setDraftArticle(article: Article, localIndex?: string){
    const db = await getDB();

    try {
        localIndex ??= article.localIndex ?? dummyIndex(article.mode);
        
        article.localIndex = localIndex;
        await db.put('drafts', article); // key localIndex is inline

        return { success: true };
    } catch(err){
        return { success: false };
    }
}

export async function getDraftArticle(localIndex?: string, mode?: Article['mode']){
    const db = await getDB();

    try {
        localIndex ??= dummyIndex(mode);
        const article = await db.get('drafts', localIndex);
        if(article === undefined) return undefined;

        if(article.localIndex === dummyIndex(article.mode)){
            delete article.localIndex;
        }
        return article;
    } catch(err){
        return undefined;
    }
}

export async function getLocalArticleList(page?: number){
    // if page is undefined, then get all articles.
    // if page is defined, then get selected page.

    const db = await getDB();

    if(page === undefined){
        return db.getAll('articles');
    }

    let cursor = await db.transaction('articles').store.openCursor() ?? undefined;
    cursor = await cursor?.advance(page * PAGE_SIZE) ?? undefined;

    let articles: Article[] = [];

    for(let i = 0; i < PAGE_SIZE; ++i){
        if(!cursor) break;
        articles.push(cursor.value);
    }

    return articles;
}

export async function getLocalArticleCount(){
    const db = await getDB();
    return db.count('articles');
}

export async function getLocalArticle(localIndex: string){
    const db = await getDB();

    try {
        const article = await db.get('articles', localIndex);

        return article;
    } catch(err) {
        return undefined;
    }
}

export async function getLocalArticleWithPublicIndex(publicIndex: string){
    const db = await getDB();

    try{
        const article = await db.getFromIndex('articles', 'publicIndex', publicIndex);

        return article;
    } catch(err){
        return undefined;
    }
}

export async function postLocalArticle(article: Article, removeDraft: boolean = true){
    const db = await getDB();

    // generate unique localIndex.
    let localIndex = '';
    do {
        localIndex = base64rand(8);
    } while( await getLocalArticle(localIndex) !== undefined );

    article.localIndex = localIndex;
    article.createDate = article.updateDate = new Date();
    
    try{
        await db.put('articles', article); // key localIndex is inline

        if(removeDraft){ // remove draft
            let { success } = await unsetDraftArticle(undefined, article.mode);
            if(!success){
                return { success: false };
            }
        }

        return { success: true, localIndex };
    } catch(err){
        return { success: false };
    }
}

export async function updateLocalArticle(localIndex: string, article: Article, shouldUpdateDate: boolean = true){
    const db = await getDB();

    article.localIndex = localIndex; // article argument might not have this localIndex anymore..? 
    if(shouldUpdateDate){
        article.updateDate = new Date();
    }

    await db.put('articles', article); // key localIndex is inline

    await unsetDraftArticle(article.localIndex); // remove draft

    return { success: true };
}

export async function removeLocalArticle(localIndex: string){
    const db = await getDB();

    await db.delete('articles', localIndex);

    await unsetDraftArticle(localIndex); // remove draft
    
    return { success: true };
}