import Axios from 'axios';
import { apiUrl } from '#/config/env';

import localforage from 'localforage';
import { base64rand } from '#/misc/base64rand';

const fileStorage = localforage.createInstance({
    name: 'image'
});

async function setLocal(key: string, file: File){
    fileStorage.setItem(key, file);
}

async function unsetLocal(key: string){
    fileStorage.removeItem(key);
}

async function getLocal(key: string) : Promise<File | undefined>{
    let item = await fileStorage.getItem(key);
    if(item === null) return undefined;

    return item as File;
}

async function getLocalIndexArr(){
    return fileStorage.keys();
}

export async function getImage(index: string){
    return getLocal(index);
}

export async function getImageUrl(index: string){
    let file = await getLocal(index);
    if(file === undefined) return '';
    
    return new Promise<string>((resolve, reject)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file ?? new Blob());
        reader.onload = () => resolve((reader.result ?? '').toString());
        reader.onerror = (err) => reject(err);
    });
}

export async function resolveImageUrl(url: string){
    if(url === '' || url === 'none'){
        return `${process.env.PUBLIC_URL}/altImg.png`;
    }
    if(url.startsWith('local::')){
        let index = url.substring('local::'.length);
        return await getImageUrl(index);
    }

    return url;
}

export async function postImage(file: File){
    if(!file.type.startsWith('image/')) throw new Error('a non-image file is uploaded on postImage');

    let indices = await getLocalIndexArr();

    let index = '';
    do {
        index = base64rand(8);
    } while( indices.includes(index) );

    await setLocal(index, file);
    return {
        success: true,
        local: true,
        url: `local::${index}`
    };
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