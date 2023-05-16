import axios from "axios";
import { apiUrl } from "#/config/env";

import type { ClassicArticle, CellArticle, Article } from '#/components/cell-editor/types';
import {
    getLocalArticle,
    getLocalArticleWithPublicIndex,
    postLocalArticle,
    updateLocalArticle
} from "./article-local-idb";

const validateStatus = (status: number) => ((200 <= status && status < 300) || status === 401);

export function ToFormData(article: Article){
    const { files, ...articleBody } = article;

    const formData = new FormData();

    formData.append('article', JSON.stringify(articleBody));
    files?.forEach(file => {
        formData.append('files', file);
    });

    return formData;
}

export async function getPublicArticleList(){ // articles except files.
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

export async function getPublicArticle(publicIndex: string, localIndex?: string, getFiles: boolean = false){

    // given publicIndex, find the article locally.
    localIndex ??= ( await getLocalArticleWithPublicIndex(publicIndex) )?.localIndex;

    let response = await axios.get(`${apiUrl}/article/get/${publicIndex}`, {
        // validateStatus,
        withCredentials: true,
        headers: {
            ...(localIndex ? {
                'Authorization': `LocalIndex ${localIndex}`
            }: {})
        }
    });

    if(response.status >= 400){
        return undefined;
    }

    // BE should've remove localIndex if not authorized.
    let article = response.data.article as Article;
    // console.log(article);
    if(getFiles){ // download files.
        article.filePaths ??= [];

        // download files here!
        // todo: lazy file download ??
        // (server) `GET /file/<publicIndex>/<path>`
        article.files = await Promise.all(
            article.filePaths.map(async path => {
                let res = await axios.get(`${apiUrl}/file/${publicIndex}/${path}`, {
                    // validateStatus,
                    withCredentials: true,
                    responseType: 'blob',
                    // transformRequest: (data, headers) => {
                    //     delete headers.common['accept'];
                    //     return data;
                    // }
                }).catch((err) => {
                    return { data: undefined, headers: {} }; // if there was an error, files should be like [ File, undefined, File, ... ]
                });

                // if(res.status >= 400){
                //     return undefined!;
                // }

                return new File([res.data], path, {
                    type: res.headers['content-type'],
                });
            })
        );
    }

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

    // (server) `POST /article/post` with form data

    try{
        // if article of post request has publicIndex(say p0) and BE has article p0, then BE should generate a new publicIndex(p1) as well as mark somewhere "p0 -> p1", for article p1 is a fork of article p0.
        let response = await axios.post(`${apiUrl}/article/post`,
            ToFormData(article),
            {
                validateStatus,
                withCredentials: true,
            }
        );

        let publicIndex = response.data.publicIndex as string; // BE should generate and return publicIndex

        if(response.status < 300 && typeof publicIndex === 'string'){
            article.publicIndex = publicIndex;

            // insert publicIndex to local article also.
            await updateLocalArticle(article.localIndex, article, false);

            return { success: true, publicIndex, localIndex: article.localIndex } as const;
        } else {
            return { success: false, publicIndex, localIndex: article.localIndex } as const;
        }
    } catch(err: any){
        return {
            success: false,
            status: err.response?.status, // 429
            publicIndex: undefined,
            localIndex: undefined
        } as const;
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

    // (server) `PUT /article/update/<publicIndex>` with form data

    let response = await axios.put(`${apiUrl}/article/update/${publicIndex}`, 
        ToFormData(article),
        {
            validateStatus,
            withCredentials: true,
            // headers: {
            //     ...(article.localIndex ? {
            //         'Authorization': `LocalIndex ${article.localIndex}`
            //     }: {})
            // }
        }
    );
    // by passing article, we also pass authority by article.localIndex (hence header not needed)
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
            await updateLocalArticle(localIndex!, article, false);

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
export async function removePublicArticle(publicIndex: string, localIndex?: string){
    // given publicIndex, find the article locally.
    localIndex ??= ( await getLocalArticleWithPublicIndex(publicIndex) )?.localIndex;

    let response = await axios.delete(`${apiUrl}/article/remove/${publicIndex}`, {
        // validateStatus,
        withCredentials: true,
        headers: {
            ...(localIndex ? {
                'Authorization': `LocalIndex ${localIndex}`
            }: {})
        }
    });
    // BE should check article.localIndex with its DB counterpart. if not match, then respond with response.status 401(unauthorized).

    // files are dropped when calling this request. don't worry.

    if(response.status >= 300){
        return { success: false };
    }

    // remove public index.
    const article = await getLocalArticle(localIndex!);
    if(article !== undefined){
        delete article.publicIndex;
        updateLocalArticle(localIndex!, article, false);
    }

    return { success: true };
}
