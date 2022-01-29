import Axios from 'axios';
import config from '../etc/config';

const apiAddress = config.apiAddress;

const uploadFile = async (collection: string, file: File) => {
    const config = {
        withCredentials: true,
        validateStatus: (status: number) => (200 <= status && status < 300),
        headers: {
            'content-type': 'multipart/form-data'
        }
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', collection);

    let response = await Axios.post(`${apiAddress}/file/upload`, formData, config);

    return response.data;
}

async function fileUpload(file: File){
    return await uploadFile('bubble', file);
}

async function imgUpload(file: File){
    if(!file.type.includes('image')) throw new Error();

    return await uploadFile('bubble', file);
}


export { fileUpload, imgUpload };