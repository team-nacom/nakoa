import axios from "axios";
import { apiUrl } from "#/config/env";

import type { ClassicArticle, CellArticle, Article } from '#/components/cell-editor/types';
import {
    getLocalArticleWithPublicIndex,
    postLocalArticle,
    updateLocalArticle
} from "./article-local-idb";

const validateStatus = (status: number) => ((200 <= status && status < 300) || status === 401);

export async function getPublicArticleList(){
    let response = await axios.get(`${apiUrl}/article/get-list`, {
        // validateStatus,
        withCredentials: true,
    });

    if(response.status >= 400){
        throw new Error('articles not found');
    }

    let articles = response.data.articles as Article[]; // BE should've removed localIndices.
    return articles;
}

export async function getPublicArticle(publicIndex: string, localIndex?: string){

    // given publicIndex, find the article locally.
    localIndex ??= ( await getLocalArticleWithPublicIndex(publicIndex) )?.localIndex;

    let response = await axios.get(`${apiUrl}/article/get/${publicIndex}`, {
        // validateStatus,
        withCredentials: true,
        headers: {
            ...(localIndex ? {
                'Authorization': localIndex && `LocalIndex ${localIndex}`
            }: {})
        }
    });

    if(response.status >= 400){
        throw new Error('article not found');
    }

    let article = response.data.article as Article; // BE should've remove localIndex.

    // if(fork){
    //     let { success, localIndex } = await postLocalArticle(article);
    //     if(!success){
    //         throw new Error('local post failed');
    //     }
    //     article.localIndex = localIndex;
    // }

    return article;
}

export async function postPublicArticle(article: Article){
    if(article.localIndex === undefined){
        // when the first article save is done as well as publishing.
        // we aren't supposed to make this branch happen.
        let { success, localIndex } = await postLocalArticle(article);
        if(!success){
            throw new Error('local post failed');
        }
        article.localIndex = localIndex!;
    }

    // if article of post request has publicIndex(say p0) and BE has article p0, then BE should generate a new publicIndex(p1) as well as mark somewhere "p0 -> p1", for article p1 is a fork of article p0.
    let response = await axios.post(`${apiUrl}/article/post`, article, {
        validateStatus,
        withCredentials: true,
    });

    let publicIndex = response.data.publicIndex as string; // BE should generate and return publicIndex

    if(response.status < 300 && typeof publicIndex === 'string'){
        article.publicIndex = publicIndex;

        // insert publicIndex to local article also.
        await updateLocalArticle(article.localIndex, article, false);

        return { success: true, publicIndex, localIndex: article.localIndex };
    } else {
        return { success: false, publicIndex, localIndex: article.localIndex };
    }
}

export async function updatePublicArticle(publicIndex: string, article: Article){
    if(article.localIndex === undefined){
        // when the first article save is done as well as updating.
        // we aren't supposed to make this branch happen.
        let { success, localIndex } = await postLocalArticle(article);
        if(!success){
            throw new Error('local post failed');
        }
        article.localIndex = localIndex!;
    }

    let response = await axios.put(`${apiUrl}/article/update/${publicIndex}`, article, {
        validateStatus,
        withCredentials: true,
    });
    // by passing article, we also pass authority by article.localIndex.
    // BE should check article.localIndex with its DB counterpart. if not match, then respond with response.status 401(unauthorized).

    if(response.status < 300){
        return {
            success: true,
            forked: false,
            publicIndex,
            localIndex: article.localIndex,
        }
    } else if(response.status === 401){
        // try again with post -- on success, the article should be forked.
        let { success, publicIndex, localIndex } = await postPublicArticle(article);
        if(success){
            article.publicIndex = publicIndex;
            await updateLocalArticle(localIndex, article, false);

            return {
                success: true,
                forked: true, // forked field is redundant since we can compare publicIndex
                publicIndex,
                localIndex
            }
        }
    }

    return {
        success: false,
        forked: false,
        //dummies
        publicIndex: '',
        localIndex: '',
    };
}

// withdrawing public article. this do not remove local article.
export async function removePublicArticle(publicIndex: string, localIndex: string){
    let response = await axios.delete(`${apiUrl}/article/remove/${publicIndex}`, {
        withCredentials: true,
        headers: {
            'Authorization': `LocalIndex ${localIndex}`
        }
    });
    // BE should check article.localIndex with its DB counterpart. if not match, then respond with response.status 401(unauthorized).

    return response.status < 300;
}

// todo: given publicIndex and localIndex, FE should be able to query if it owns the article.