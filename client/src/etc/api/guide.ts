import Axios from 'axios';
import { authValidateStatus } from '.';
import config from '../config';

const apiAddress = config.apiAddress;

export interface GuideType {
    index?: number;
    name: string;
    content: string;
    isPublic?: boolean;
    authors: string[];
}

export const priorityTags = ['Draft', 'Optional', 'Readable', 'Recommendable', 'Essential'] as const;

export type PriorityTags = typeof priorityTags[number];

export type GuideFilterType = {
    [k in PriorityTags]: boolean
};

export const defaultGuideFilter : GuideFilterType = {
    Optional: true,
    Readable: true,
    Recommendable: true,
    Essential: true,
    Draft: false,
}

export const getGuides = async () => {
    let response = await Axios.get(`${apiAddress}/guide?per=100`, {
        validateStatus: authValidateStatus, 
        withCredentials: true 
    });

    return response.data as GuideType[];
}

export const getGuideMaxIndex = async () => {
    let response = await Axios.get(`${apiAddress}/guide/indices`);

    return response.data;
}

export const getGuide = async (id: number) => {
    let response = await Axios.get(`${apiAddress}/guide/${id}`, {
        validateStatus: authValidateStatus, 
        withCredentials: true 
    });

    return response.data as GuideType;
}

/*export const getGuideCategories = async () => {
    let response = await Axios.get(`${apiAddress}/guide/category`);

    return response.data as string[];
}

export const getGuideSections = async (categoryName: string) => {
    if (categoryName.length === 0) return [];
    
    let response = await Axios.get(`${apiAddress}/guide/category/${categoryName}`);

    return response.data as string[];
}*/

export const postGuide = async (data: GuideType) => {
    if (data.isPublic === undefined) data.isPublic = true;
    
    let response = await Axios.post(`${apiAddress}/guide`, data, {
        validateStatus: authValidateStatus, 
        withCredentials: true 
    });

    return {
        success: response.status < 300,
        index: response.data.index,
    };
}

export const editGuide = async (index: number, data: GuideType) => {    
    data.index = index;
    delete data.isPublic;
    
    let response = await Axios.put(`${apiAddress}/guide/${index}`, data, {
        validateStatus: authValidateStatus, 
        withCredentials: true 
    });

    return response.status < 300;
}

export const removeGuide = async (id: number) => {
    let response = await Axios.delete(`${apiAddress}/guide/${id}`, { withCredentials: true })

    return response.status < 300;
}

//export const postTempGuide = async (data: GuideType) => {
    // This will be written after server-side draft logic is done.
//}
