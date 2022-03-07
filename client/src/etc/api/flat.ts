import Axios from 'axios';
import { authValidateStatus } from '.';
import config from '../config';

import { Flat } from 'components/naflat/flat';

const apiAddress = config.apiAddress;

export interface FlatUploadItem {
    title: string,
    author: string,
    content: string, //dumped -> stringified flat object
}

export interface FlatItem extends FlatUploadItem {
    // title: string,
    // author: string,
    // content: string,
    index: string;
    createDate: number,
    hidden: boolean,
}

export const getFlatsByAuthor = async (author: string) => {
    let response = await Axios.get(`${apiAddress}/flat/author/${author}`, {
        validateStatus: authValidateStatus,
    });

    return response.data as FlatItem[];
}

export const getFlat = async (index: string) => {
    let response = await Axios.get(`${apiAddress}/flat/view/${index}`, {
        validateStatus: authValidateStatus, 
    });

    return response.data as FlatItem;
}

export const postFlat = async (title: string, author: string, flat: Flat) => {
    const data: FlatUploadItem = {
        title: title,
        author: author,
        content: JSON.stringify(flat),
    };
    let response = await Axios.post(`${apiAddress}/flat`, data, {
        validateStatus: authValidateStatus, 
    });

    return {
        success: response.status < 300,
        index: response.data.index,
    };
}

export const hideFlat = async (index: string) => {
    let response = await Axios.put(`${apiAddress}/flat/hide/${index}`)

    return response.status < 300;
}

export const unhideFlat = async (index: string) => {
    let response = await Axios.put(`${apiAddress}/flat/unhide/${index}`)

    return response.status < 300;
}

// Internal APIs

export const getAllFlats = async () => {
    let response = await Axios.get(`${apiAddress}/flat/debug`, {
        validateStatus: authValidateStatus, 
    });

    return response.data as FlatItem[];
}

export const removeFlat = async (index: string) => {
    let response = await Axios.delete(`${apiAddress}/flat/delete/${index}`)

    return response.status < 300;
}
