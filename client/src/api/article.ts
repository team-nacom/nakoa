// 23/01/16 revert & refactored from:
// https://github.com/team-nacom/nakoa/blob/2f279ea8335995a722ccf01896deb5364c405ba2/client/src/etc/api/guide.ts

import axios from "axios";
import { base64rand } from '#/misc/base64rand';
import localforage from 'localforage';

import { apiUrl } from "#/config/env";

import type { ClassicArticle, BasicCellArticle } from '#common/Article';

import type { Cell } from "#/components/cell-editor/cell";

export type { ClassicArticle };
export type CellArticle = BasicCellArticle<Cell>;
export type Article = ClassicArticle | CellArticle;

export const validateStatus = (status: number) => ((200 <= status && status < 300) || status === 401);

// export const validateSetStatus = (status: number) => (status < 300);


///////////////// db-specific implementation

const articleStorage = localforage.createInstance({
    name: 'article'
});

async function setLocal(key: string, article: Article){
    articleStorage.setItem(key, article);
}

async function unsetLocal(key: string){
    articleStorage.removeItem(key);
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
    if(article && article.mode !== mode){
        return undefined;
    }
    return article;
}


// todo : remoteIndex field for each article.

export async function getArticleList(){
    // serverless.
    return getLocalAll();

    let response = await axios.get(`${apiUrl}/article/get-list`, {
        // validateStatus,
        withCredentials: true,
    });

    if(response.status >= 400){
        throw new Error('articles not found');
    }

    return response.data.articles as Article[];
}

export async function getArticle(index: string){
    // serverless.
    let key = `data/${index}`;

    let article = getLocal(key);
    if(article === undefined){
        throw new Error('article not found');
    }
    return article;

    let response = await axios.get(`${apiUrl}/article/get/${index}`, {
        // validateStatus,
        withCredentials: true,
    });

    if(response.status === 404){
        throw new Error('article not found');
    }

    return response.data as Article;
}

export async function postArticle(article: Article){
    // serverless.
    let index = await generateUniqueIdx();

    article.index = index;
    article.createDate = article.updateDate = new Date();
    
    let key = `data/${index}`;
    await setLocal(key, article);

    // remove draft.
    let draftkey = `article/draft-unpub/${article.mode}`;
    await unsetLocal(draftkey);

    return {
        success: true,
        index
    };
    


    // on publishing, the article is given a new index which server has generated.
    // instead of using different idx, how about distinguishing with (userid, idx) ??

    let response = await axios.post(`${apiUrl}/article/post`, article, {
        validateStatus,
        withCredentials: true,
    });

    return {
        success: response.status < 300,
        index: response.data.index as string,
    };
}

export async function updateArticle(index: string, article: Article){
    // serverless

    article.index = index; // article argument might not have index anymore
    article.updateDate = new Date();

    let key = `data/${index}`;
    await setLocal(key, article);
    return true;

    // NOTE: index가 article의 optional field니까, 그냥 article만 넣고 싶긴 함
    // 아니면 article에서 그냥 빼버릴까?
    let response = await axios.put(`${apiUrl}/article/update/${index}`, article, {
        validateStatus,
        withCredentials: true,
    });

    return response.status < 300;
}

export async function removeArticle(index: string){
    // serverless

    let key = `data/${index}`;
    await unsetLocal(key);
    return true;

    let response = await axios.delete(`${apiUrl}/article/remove/${index}`, {
        withCredentials: true,
    });

    return response.status < 300;
}