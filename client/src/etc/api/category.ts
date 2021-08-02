import Axios from 'axios';
import { authValidateStatus } from '.';
import config from '../config';
import { GuideType } from './guide';

const apiAddress = config.apiAddress;

export interface CateType {
    index: number;
    name: string;
    gories: string[];
}

export const getCates = async () => {
    let response = await Axios.get(`${apiAddress}/category`);

    return response.data.cates as CateType[];
}

export interface CatePostType {
    name: string;
    gories: string[];
}

export const postCate = async (cate: CatePostType) => {
    let response = await Axios.post(`${apiAddress}/category/cate`, cate, {
        validateStatus: authValidateStatus, 
        withCredentials: true 
    });

    return {
        success: response.status < 300,
        index: response.data.index as number,
    };
}

export interface GoryType {
    index: string;
    name: string;
    guides: number[];
}

export const getCateDetail = async (cateIndex: number) => {
    let response = await Axios.get(`${apiAddress}/category/cate/${cateIndex}`);

    console.log(response.data);
    return {
        name: response.data.name as string,
        gories: response.data.gories as GoryType[],
    };
}

export const getGoryDetail = async (goryIndex: string) => {
    let response = await Axios.get(`${apiAddress}/category/gory/${goryIndex}`);

    return {
        name: response.data.name as string,
        guides: response.data.guides as GuideType[],
    }
}

export const getCategoryDetail = async (cateIndex: number, goryIndex: string) => {
    let response = await Axios.get(`${apiAddress}/category/${cateIndex}/${goryIndex}`);

    return {
        cateName: response.data.cateName as string,
        goryName: response.data.goryName as string,
        guides: response.data.guides as GuideType[],
    }
}

export interface GoryPostType {
    name: string;
    cate: number;
    guides: number[];
}

export const postGory = async (gory: GoryPostType) => {
        
    let response = await Axios.post(`${apiAddress}/category/gory`, gory, {
        validateStatus: authValidateStatus, 
        withCredentials: true 
    });

    return {
        success: response.status < 300,
        index: response.data.index as string,
    };
}