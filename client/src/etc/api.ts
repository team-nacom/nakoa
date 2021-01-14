import Axios from 'axios';
import config from './config';

const apiAddress = config.apiAddress;
export interface Chall {
    _id: string;
    index: number;
    name: string;
    solveCount: number;
    problemUrl: string;
    solutionUrl: string;
    createDate: number;
    problemOpenDate: number;
    solutionOpenDate: number;
}

export const getChallList = async () => {
    let response = await Axios.get<Chall[]>(`${apiAddress}/chall`);

    return response.data;
}

export const getChallInfo = async (id: number) => {
    let response = await Axios.get<Chall>(`${apiAddress}/chall/${id}`);

    return response.data;
}