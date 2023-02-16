import Axios from 'axios';
import { apiUrl } from '#/config/env';

export const authValidateStatus = (status: number) => ((200 <= status && status < 300) || status === 401);

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

export async function imgUpload(file: File){
    if(!file.type.startsWith('image/')) throw new Error();

    let result = await uploadFile('guide', file);
    return result.success ? result.url : null;
}