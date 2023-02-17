// 23/01/16 revert & refactored from:
// https://github.com/team-nacom/nakoa/blob/2f279ea8335995a722ccf01896deb5364c405ba2/client/src/etc/api/guide.ts

import axios from "axios";
import { customAlphabet } from 'nanoid';

import { apiUrl } from "#/config/env";

import type { ClassicArticle, BasicCellArticle } from '#common/Article';

import type { Cell } from "#/components/cell-editor/cell";

export type { ClassicArticle };
export type CellArticle = BasicCellArticle<Cell>;
export type Article = ClassicArticle | CellArticle;

export const validateStatus = (status: number) => ((200 <= status && status < 300) || status === 401);

// export const validateSetStatus = (status: number) => (status < 300);


const base64url = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789-_=';
function baseid(count: number): string {
    const nanoid = customAlphabet(base64url, count);
    return nanoid();
}


function setLocal(key: string, article: Article){
    localStorage.setItem(key, JSON.stringify(article));
}

function getLocal(key: string) : Article | undefined{
    let item = localStorage.getItem(key);
    if(item === null) return undefined;
    console.log(key, JSON.parse(item));
    return JSON.parse(item) as Article;
}

function unsetLocal(key: string){
    localStorage.removeItem(key);
}

function getLocalIdxArr(){
    // let keys = JSON.parse(localStorage.getItem(`article/keys`) ?? '[]');
    // return Array.isArray(keys) ? keys as string[] : [];
    return Object.keys(localStorage)
        .map((key) => {
            let res = key.match(/article\/data\/(?<index>[^\/]*)/);
            if(res === null) return undefined;
            return res.groups?.index;
        })
        .filter((k): k is string => k !== undefined);
}


export function setAutosaveArticle(article: Article, index?: string){
    // in browser cache

    // TODO: manage localStorage key list
    let key = index !== undefined
        ? `article/draft/${index}`
        : `article/draft-unpub/${article.mode}`;

    setLocal(key, article);
    return { success: true, };
}

export function getAutosaveArticle(index?: string, mode?: Article['mode']){
    let key = index !== undefined
        ? `article/draft/${index}`
        : `article/draft-unpub/${mode}`;

    return getLocal(key);
}


// todo : remoteIndex field for each article.

export async function getArticleList(){
    // serverless.
    let articles = getLocalIdxArr().map((idx) => {
        let key = `article/data/${idx}`;
        return getLocal(key);
    }).filter((a) : a is Article => a !== undefined );
    
    return articles;

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
    let key = `article/data/${index}`;

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
    let index = '';
    do{
        index = baseid(8);
    } while( localStorage.getItem(index) !== null );

    article.index = index;
    article.createDate = article.updateDate = new Date();
    
    let key = `article/data/${index}`;
    setLocal(key, article);

    // remove draft.
    let draftkey = `article/draft-unpub/${article.mode}`;
    unsetLocal(draftkey);

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

    let key = `article/data/${index}`;
    setLocal(key, article);
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

    let key = `article/data/${index}`;
    unsetLocal(key);
    return true;

    let response = await axios.delete(`${apiUrl}/article/remove/${index}`, {
        withCredentials: true,
    });

    return response.status < 300;
}