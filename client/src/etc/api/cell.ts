import Axios from 'axios';
import { authValidateStatus } from '.';
import config from '../config';

import { Flat } from 'components/naflat/flat';

const apiAddress = config.apiAddress;

export interface CellUploadType {
    title: string,
    author: string,
    content: string,
}

export interface CellType extends CellUploadType {
    // title: string,
    // author: string,
    // content: string,
    index: string;
    createDate: number,
    hidden: boolean,
}

export const getCellsByAuthor = async (author: string) => {
    let response = await Axios.get(`${apiAddress}/cell/author/${author}`, {
        validateStatus: authValidateStatus,
    });

    return response.data as CellType[];
}

export const getCell = async (index: string) => {
    let response = await Axios.get(`${apiAddress}/cell/view/${index}`, {
        validateStatus: authValidateStatus, 
    });

    return response.data as CellType;
}

export const postCell = async (flat: Flat) => {
    const data: CellUploadType = {
        title: "untitled",
        author: "unknown",
        content: JSON.stringify(flat),
    };
    let response = await Axios.post(`${apiAddress}/cell`, data, {
        validateStatus: authValidateStatus, 
    });

    return {
        success: response.status < 300,
        index: response.data.index,
    };
}

export const hideBubble = async (index: string) => {
    let response = await Axios.put(`${apiAddress}/cell/hide/${index}`)

    return response.status < 300;
}

export const unhideBubble = async (index: string) => {
    let response = await Axios.put(`${apiAddress}/cell/unhide/${index}`)

    return response.status < 300;
}

// Internal APIs

export const getAllBubbles = async () => {
    let response = await Axios.get(`${apiAddress}/cell/debug`, {
        validateStatus: authValidateStatus, 
    });

    return response.data as CellType[];
}

export const removeBubble = async (index: string) => {
    let response = await Axios.delete(`${apiAddress}/cell/delete/${index}`)

    return response.status < 300;
}
