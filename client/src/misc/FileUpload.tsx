import { uploadFile } from "#/api";

export async function fileUpload(file: File){
    let result = await uploadFile('guide', file);
    return result.success ? result.url : null;
}

export async function imgUpload(file: File){
    if(!file.type.startsWith('image/')) throw new Error('a non-image file is uploaded on imgUpload');

    let result = await uploadFile('guide', file);
    return result.success ? result.url : null;
    
    // return 'https://img.khan.co.kr/news/2021/03/14/l_2021031401001628900137951.jpg'; //TEMP muyaho
}