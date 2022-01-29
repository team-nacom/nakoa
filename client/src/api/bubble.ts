import Axios from 'axios';
import { authValidateStatus } from './common';
import config from '../config';

const apiAddress = config.apiAddress;

export interface BubbleType {
    title: string,
    author: string,
    index: string;
    content: string;
    createDate: number;
    tags: string[],
    hidden: boolean,
}

export interface BubblePost {
    title: string,
    author: string,
    content: string,
    tags: string[],
}

export const getAllBubbles = async () => {
    let response = await Axios.get(`${apiAddress}/bubble/debug`, {
        validateStatus: authValidateStatus, 
    });

    return response.data as BubbleType[];
}

export const getBubblesByAuthor = async (author: string) => {
    let response = await Axios.get(`${apiAddress}/bubble/author/${author}`, {
        validateStatus: authValidateStatus, 
    });

    return response.data as BubbleType[];
}

export const getBubble = async (index: string) => {
    let response = await Axios.get(`${apiAddress}/bubble/view/${index}`, {
        validateStatus: authValidateStatus, 
    });

    return response.data as BubbleType;
}

export const postBubble = async (data: BubblePost) => {   
    let response = await Axios.post(`${apiAddress}/bubble`, data, {
        validateStatus: authValidateStatus, 
    });

    return {
        success: response.status < 300,
        index: response.data.index,
    };
}

export const removeBubble = async (index: string) => {
    let response = await Axios.delete(`${apiAddress}/bubble/delete/${index}`)

    return response.status < 300;
}

export const hideBubble = async (index: string) => {
    let response = await Axios.put(`${apiAddress}/bubble/hide/${index}`)

    return response.status < 300;
}

export const unhideBubble = async (index: string) => {
    let response = await Axios.put(`${apiAddress}/bubble/unhide/${index}`)

    return response.status < 300;
}