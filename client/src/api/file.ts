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
        index
    };
}