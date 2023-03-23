// 23/01/16 revert & refactored from:
// https://github.com/team-nacom/nakoa/blob/2f279ea8335995a722ccf01896deb5364c405ba2/client/src/etc/api/guide.ts

import { base64rand } from '#/misc/base64rand';
import localforage from 'localforage';

import type { ClassicArticle, BasicCellArticle } from '#common/Article';

import type { Cell } from "#/components/cell-editor/cell";

export type { ClassicArticle };
export type CellArticle = BasicCellArticle<Cell>;
export type Article = ClassicArticle | CellArticle;

const validateStatus = (status: number) => ((200 <= status && status < 300) || status === 401);

// const validateSetStatus = (status: number) => (status < 300);


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
            let res = key.match(/data\/(?<index>[^\/]*)/);
            if(res === null) return undefined;
            return res.groups?.index;
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

export async function unsetAutosaveArticle(index?: string, mode?: Article['mode']){
    let key = index !== undefined
        ? `draft/${index}`
        : `draft-unpub/${mode}`;

    await unsetLocal(key);
    return { success: true };
}

export async function setAutosaveArticle(article: Article, index?: string){
    // in browser cache

    // TODO: manage storage key list
    let key = index !== undefined
        ? `draft/${index}`
        : `draft-unpub/${article.mode}`;

    await setLocal(key, article);
    return { success: true };
}

export async function getAutosaveArticle(index?: string, mode?: Article['mode']){
    let key = index !== undefined
        ? `draft/${index}`
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

export async function getLocalArticle(index: string){
    // serverless.
    let key = `data/${index}`;

    let article = getLocal(key);
    if(article === undefined){
        throw new Error('article not found');
    }
    return article;
}

export async function postLocalArticle(article: Article, removeDraft: boolean = true){
    // serverless.

    // set localIndex.
    let index = await generateUniqueIdx();
    article.localIndex = index;
    article.createDate = article.updateDate = new Date();
    
    let key = `data/${index}`;
    await setLocal(key, article);

    if(removeDraft){
        // remove draft.
        let draftkey = `draft-unpub/${article.mode}`;
        await unsetLocal(draftkey);
    }

    return {
        success: true,
        index
    };
}

export async function updateLocalArticle(index: string, article: Article, shouldUpdateDate: boolean = true){
    // serverless

    article.localIndex = index; // article argument might not have this index anymore
    if(shouldUpdateDate){
        article.updateDate = new Date();
    }

    let key = `data/${index}`;
    await setLocal(key, article);
    return true;
}

export async function removeLocalArticle(index: string){
    // serverless

    let key = `data/${index}`;
    await unsetLocal(key);
    return true;
}