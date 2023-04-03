import { base64rand } from '#/misc/base64rand';
import localforage from 'localforage';



import type { ClassicArticle, BasicCellArticle } from '#common/Article';

import type { Cell } from "#/components/cell-editor/cell";

export type { ClassicArticle };
export type CellArticle = BasicCellArticle<Cell>;
export type Article = ClassicArticle | CellArticle;

///////////////// db-specific implementation

const articleStorage = localforage.createInstance({
    name: 'article'
});

async function setLocal(key: string, article: Article){
    await articleStorage.setItem(key, article);
}

async function unsetLocal(key: string){
    await articleStorage.removeItem(key);
}

async function getLocal(key: string) : Promise<Article | undefined>{
    let item = await articleStorage.getItem(key);
    if(item === null) return undefined;

    return item as Article;
}

async function getLocalAll(){
    let articles = (await Promise.all(
        (await getLocalIdxArr()).map(async (idx) => {
            let key = `data/${idx}`;
            return await getLocal(key);
        })
    )).filter((a) : a is Article => a !== undefined );

    return articles;
}

async function getLocalIdxArr(){
    let keys = await articleStorage.keys();

    return keys.map((key) => {
            let res = key.match(/data\/(?<localIndex>[^\/]*)/);
            if(res === null) return undefined;
            return res.groups?.localIndex;
        })
        .filter((k): k is string => k !== undefined);
}

async function generateUniqueIdx(){
    let indices = await getLocalIdxArr();

    let index = '';
    do{
        index = base64rand(8);
    } while( indices.includes(index) );

    return index;
}

////////////////////////

export async function unsetDraftArticle(localIndex?: string, mode?: Article['mode']){
    let key = localIndex !== undefined
        ? `draft/${localIndex}`
        : `draft-unpub/${mode}`;

    await unsetLocal(key);
    return { success: true };
}

export async function setDraftArticle(article: Article, localIndex?: string){
    // in browser cache

    // TODO: manage storage key list
    let key = localIndex !== undefined
        ? `draft/${localIndex}`
        : `draft-unpub/${article.mode}`;

    await setLocal(key, article);
    return { success: true };
}

export async function getDraftArticle(localIndex?: string, mode?: Article['mode']){
    let key = localIndex !== undefined
        ? `draft/${localIndex}`
        : `draft-unpub/${mode}`;
    
    let article = await getLocal(key);
    if(article && mode && article.mode !== mode){
        return undefined;
    }
    return article;
}


export async function getLocalArticleList(){
    return getLocalAll();
}

export async function getLocalArticle(localIndex: string){
    // serverless.
    let key = `data/${localIndex}`;

    let article = getLocal(key);
    if(article === undefined){
        throw new Error('article not found');
    }
    return article;
}

export async function postLocalArticle(article: Article, removeDraft: boolean = true){
    // serverless.

    // set localIndex.
    let localIndex = await generateUniqueIdx();
    article.localIndex = localIndex;
    article.createDate = article.updateDate = new Date();
    
    let key = `data/${localIndex}`;
    await setLocal(key, article);

    if(removeDraft){
        // remove draft.
        // let draftkey = `draft-unpub/${article.mode}`;
        // await unsetLocal(draftkey);
        await unsetDraftArticle(undefined, article.mode);
    }

    return {
        success: true,
        localIndex
    };
}

export async function updateLocalArticle(localIndex: string, article: Article, shouldUpdateDate: boolean = true){
    // serverless

    article.localIndex = localIndex; // article argument might not have this localIndex anymore
    if(shouldUpdateDate){
        article.updateDate = new Date();
    }

    let key = `data/${localIndex}`;
    await setLocal(key, article);
    return true;
}

export async function removeLocalArticle(localIndex: string){
    // serverless

    let key = `data/${localIndex}`;
    await unsetLocal(key);
    return true;
}