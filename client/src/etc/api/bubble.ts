import Axios from 'axios';
import { authValidateStatus } from '.';
import config from '../config';

import { dispatchNaBubbleState as dispatch } from 'components/nabubble';

const apiAddress = config.apiAddress;

export interface BubbleType {
    name: string,
    index: number;
    content: string;
    createDate: number;
    tags: string[],
}

export interface BubblePost {
    name: string,
    author: string,
    content: string,
    tags: string[],
}

export const getBubbles = async () => {
    let response = await Axios.get(`${apiAddress}/bubble/debug`, {
        validateStatus: authValidateStatus, 
    });

    return response.data as BubbleType[];
}

export const getBubble = async (index: string) => {
    let response = await Axios.get(`${apiAddress}/bubble/view/${index}`, {
        validateStatus: authValidateStatus, 
    });

    let content = response.data.content;
    while(typeof content === 'string'){
        content = JSON.parse(content);
    }

    dispatch({
        type: 'init',
        bubble: content || {
            type: 'parent',
            children : [ {type: 'text', value: ''} ]
        }
    })

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
    let response = await Axios.delete(`${apiAddress}/bubble/delete${index}`)

    return response.status < 300;
}