// https://stackoverflow.com/questions/50774176/sending-file-and-json-in-post-multipart-form-data-request-with-axios
// https://stackoverflow.com/questions/58381990/react-axios-multiple-files-upload

import {normalizeUri} from 'micromark-util-sanitize-uri';

import Axios from 'axios';
import { apiUrl } from '#/config/env';

import { base64rand } from '#/misc/base64rand';
import getDB from '#/config/db-idb';

export async function fileToUrl(file: File){
    return new Promise<string>((resolve, reject)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file ?? new Blob());
        reader.onload = () => resolve((reader.result ?? '').toString());
        reader.onerror = (err) => reject(err);
    });
}

/**
 * get local file from local and attachment indexes
 * @param localIndex local article index
 * @param attachmentIndex attachment index in this article
 * @returns local file
 */
export async function getFile(localIndex: string, attachmentIndex: string){
    const db = await getDB();

    return (await db.get('files', [localIndex, attachmentIndex]))?.file;
}

/**
 * get src-attachable url(`data:`) of local file from local and attachment indexes
 * @param localIndex local article index
 * @param attachmentIndex attachment index in this article
 * @returns local file url
 */
export async function getFileUrl(localIndex: string, attachmentIndex: string){
    let file = await getFile(localIndex, attachmentIndex);
    if(file === undefined) return '';
    
    return fileToUrl(file);
}

/**
 * format attachment index into markdown img/link source string.
 * @param attachmentIndex attachment index
 * @returns formatted string
 */
export async function attachmentIndexToUrl(attachmentIndex: string){
    return `embed::${attachmentIndex}`;
}

// export async function resolveUrl(url: string, articleLocalIndex: string, asImg?: boolean){
//     if(asImg && (url === '' || url === 'none')){
//         return `${process.env.PUBLIC_URL}/altImg.png`;
//     }
//     if(url.startsWith('embed::')){
//         let attachmentIndex = url.substring('embed::'.length);
//         return await getFileUrl(attachmentIndex, articleLocalIndex);
//     }
//     return url;
// }

export async function resolveUrlWithMap(url: string, map: Record<string, File>, asImg?: boolean){
    if(asImg && (url === '' || url === 'none')){
        return `${process.env.PUBLIC_URL}/altImg.png`;
    }
    if(url.startsWith('embed::')){
        let path = url.substring('embed::'.length);
        if(map[path]) return await fileToUrl(map[path]);
        
        return '';
    }
    return normalizeUri(url);
}

export async function setFile(file: File, localIndex: string, attachmentIndex?: string){
    // if(!file.type.startsWith('image/')) throw new Error('a non-image file is uploaded on postImage');

    const db = await getDB();

    // post. otherwise put.
    if(attachmentIndex === undefined){
        do {
            attachmentIndex = base64rand(8);
        } while( await db.get('files', [localIndex, attachmentIndex]) !== undefined );
    }    

    try {
        await db.put('files', { localIndex, attachmentIndex, file });
        return {
            success: true,
            attachmentIndex,
            url: await attachmentIndexToUrl(attachmentIndex) // data:// url.
        };
    } catch(err){
        return { success: false };
    }
}

export async function setFileWithMap(file: File, map: Record<string, File>, attachmentIndex?: string){
    if(attachmentIndex === undefined){
        do {
            attachmentIndex = base64rand(8);
        } while( map[attachmentIndex] !== undefined );
    }
    map[attachmentIndex] = file;
    return {
        success: true,
        attachmentIndex,
        url: await attachmentIndexToUrl(attachmentIndex), // data:// url.
    };
}

export async function deleteFile(localIndex: string, attachmentIndex: string){
    const db = await getDB();

    try {
        await db.delete('files', [localIndex, attachmentIndex]);
        return { success: true };
    } catch(err){
        return { success: false };
    }
}


///////////////////////////////////////////////////// legacy ////////////////////////////

// export const authValidateStatus = (status: number) => ((200 <= status && status < 300) || status === 401);

export const uploadFile = async (collection: string, file: File) => {
    const config = {
        withCredentials: true,
        headers: {
            'content-type': 'multipart/form-data'
        }
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', collection);

    let response = await Axios.post(`${apiUrl}/file/upload`, formData, config);

    return {
        success: response.status < 300,
        url: response.data,
    };
}

export async function fileUpload(file: File){
    let result = await uploadFile('guide', file);
    return result.success ? result.url : null;
}

// export async function imgUpload(file: File){
//     if(!file.type.startsWith('image/')) throw new Error();

//     let result = await uploadFile('guide', file);
//     return result.success ? result.url : null;
// }