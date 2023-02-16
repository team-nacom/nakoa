// 23/01/16 revert & refactored from:
// https://github.com/team-nacom/nakoa/blob/2f279ea8335995a722ccf01896deb5364c405ba2/client/src/etc/api/guide.ts

import axios from "axios";
import { apiUrl } from "#/config/env";

import type { IdxType, ClassicArticle, BasicCellArticle } from '#common/Article';
import { toIdx } from '#common/Article';

import type { Cell } from "#/components/cell-editor/cell";

export type { IdxType };
export { toIdx };

export type { ClassicArticle };
export type CellArticle = BasicCellArticle<Cell>;
export type Article = ClassicArticle | CellArticle;

export const validateStatus = (status: number) => ((200 <= status && status < 300) || status === 401);

// export const validateSetStatus = (status: number) => (status < 300);

export function setAutosaveArticle(article: Article, index?: IdxType){
    // in browser cache
    var key = index !== undefined ? `article/draft-${index}` : `article/draft-unpub-${article.mode}`;

    // var index: IdxType = toIdx(localStorage.getItem('articleNextIndex') ?? '1');
    // localStorage.setItem('articleNextIndex', `${ Number(index) + 1 }`);

    localStorage.setItem(key, JSON.stringify(article)); // TODO: manage localStorage key list
    return { success: true, };
}

export function getAutosaveArticle(index?: IdxType, mode?: Article['mode']){
    var key = index !== undefined ? `article/draft-${index}` : `article/draft-unpub-${mode}`;

    var item = localStorage.getItem(key);
    if(item === null) return undefined;
    return JSON.parse(item) as Article;
}

export async function getArticleList(){
    let response = await axios.get(`${apiUrl}/article/get-list`, {
        // validateStatus,
        withCredentials: true,
    });

    if(response.status >= 400){
        throw new Error('articles not found');
    }

    return response.data.articles as Article[];
}

export async function getArticle(index: IdxType){
    // tmp: serverless
    // var item = localStorage.getItem(`article/${index}`)
    // if(item === null) return undefined;
    // return JSON.parse(item) as Article;

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
    // tmp: serverless
    // var index: IdxType = toIdx(localStorage.getItem('articleNextIndex') ?? '1');
    // localStorage.setItem('articleNextIndex', `${ Number(index) + 1 }`);

    // localStorage.setItem(`article/${index}`, JSON.stringify(article));
    // return {
    //     success: true,
    //     index
    // };

    let response = await axios.post(`${apiUrl}/article/post`, article, {
        validateStatus,
        withCredentials: true,
    });

    return {
        success: response.status < 300,
        index: response.data.index as number,
    };
}

export async function updateArticle(index: IdxType, article: Article){
    // tmp: serverless
    // localStorage.setItem(`article/${index}`, JSON.stringify(article));
    // return true;

    // NOTE: index가 article의 optional field니까, 그냥 article만 넣고 싶긴 함
    // 아니면 article에서 그냥 빼버릴까?
    let response = await axios.put(`${apiUrl}/article/update/${index}`, article, {
        validateStatus,
        withCredentials: true,
    });

    return response.status < 300;
}

export async function removeArticle(index: IdxType){
    // tmp: serverless
    // localStorage.removeItem(`article/${index}`);
    // return true;

    let response = await axios.delete(`${apiUrl}/article/remove/${index}`, {
        withCredentials: true,
    });

    return response.status < 300;
}