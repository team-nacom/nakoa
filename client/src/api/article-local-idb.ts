import { base64rand } from '#/misc/base64rand';
import getDB from '#/config/db-idb';

import type { Article } from '#/components/cell-editor/types';

const dummyIndex = (s: string | undefined) => {
    if(s === undefined) throw new Error();
    return `&${s}`;
}

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
        console.log(err);
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

export async function getLocalArticleList(){
    const db = await getDB();

    const articles = await db.getAll('articles');

    return articles;
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
    const db = await getDB();

    let localIndex = await generateUniqueIdx();
    article.localIndex = localIndex;
    article.createDate = article.updateDate = new Date();
    
    try{
        await db.put('articles', article); // key localIndex is inline

        if(removeDraft){
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

    article.localIndex = localIndex; // article argument might not have this localIndex anymore
    if(shouldUpdateDate){
        article.updateDate = new Date();
    }

    await db.put('articles', article); // key localIndex is inline

    return { success: true };
}

export async function removeLocalArticle(localIndex: string){
    const db = await getDB();

    await db.delete('articles', localIndex);
    
    return { success: true };
}