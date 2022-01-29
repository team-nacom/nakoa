import Axios from 'axios';
import config from '../etc/config';

const apiAddress = config.apiAddress;

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

    let response = await Axios.post(`${apiAddress}/file/upload`, formData, config);

    return {
        success: response.status < 300,
        url: response.data,
    };
}