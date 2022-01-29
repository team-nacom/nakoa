import { uploadFile } from ".";

async function fileUpload(file: File){
    let result = await uploadFile('guide', file);
    return result.success ? result.url : null;
}

async function imgUpload(file: File){
    if(!file.type.includes('image')) throw new Error();

    let result = await uploadFile('guide', file);
    return result.success ? result.url : null;
    
    // return 'https://img.khan.co.kr/news/2021/03/14/l_2021031401001628900137951.jpg'; //TEMP
}


export { fileUpload, imgUpload };