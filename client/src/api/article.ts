// 23/01/16 revert & refactored from:
// https://github.com/team-nacom/nakoa/blob/2f279ea8335995a722ccf01896deb5364c405ba2/client/src/etc/api/guide.ts

import axios from "axios";
import config from "#/misc/config";

import {
    ClassicArticle, BasicCellArticle
} from '#/../../common/Article'


import { StructData } from "#/components/cell-editor/types";
import { Cell, CellData } from "#/components/cell-editor/cell";

const apiAddress = config.apiAddress;

export type { ClassicArticle };
export type CellArticle = BasicCellArticle<Cell>;
export type Article = ClassicArticle | CellArticle;

export const validateStatus = (status: number) => ((200 <= status && status < 300) || status === 401);

// export const validateSetStatus = (status: number) => (status < 300);

export async function getArticle(index: number){
    // tmp: serverless
    var item = localStorage.getItem(`article/${index}`)
    if(item === null) return undefined;
    return JSON.parse(item) as Article;

    // let response = await axios.get(`${apiAddress}/article/${index}`, {
    //     validateStatus,
    //     // withCredentials: true
    // });

    // return response.data as Article;
}

export async function postArticle(article: Article){
    // tmp: serverless
    var index: number = Number(localStorage.getItem('articleNextIndex') ?? 1);
    localStorage.setItem('articleNextIndex', `${ index + 1 }`);

    localStorage.setItem(`article/${index}`, JSON.stringify(article));
    return {
        success: true,
        index
    };

    // let response = await axios.post(`${apiAddress}/article`, article, {
    //     validateStatus,
    //     // withCredentials: true
    // });

    // return {
    //     success: response.status < 300,
    //     index: response.data.index as number,
    // };
}

export async function updateArticle(index: number, article: Article){
    // tmp: serverless
    localStorage.setItem(`article/${index}`, JSON.stringify(article));
    return true;

    // NOTE: index가 article의 optional field니까, 그냥 article만 넣고 싶긴 함
    // 아니면 article에서 그냥 빼버릴까?
    // let response = await axios.put(`${apiAddress}/article/${index}`, article, {
    //     validateStatus,
    //     // withCredentials: true
    // });

    // return response.status < 300;
}

export async function removeArticle(index: number){
    localStorage.removeItem(`article/${index}`);
    return true;

    // let response = await axios.delete(`${apiAddress}/article/${index}`, {
    //     //withCredentials: true
    // });

    // return response.status < 300;
}