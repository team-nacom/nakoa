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
    let response = await Axios.get(`${apiAddress}/chall/${id}`);

    return response.data;
}

export interface Quiz {
    _id: string;
    index: number;
    name: string;
    description: string;
    choices: string[];
    answer: string;
    explanation: string;
    createDate: number;
}

export const getQuizList = async () => {
    let response = await Axios.get<Quiz[]>(`${apiAddress}/quiz`);
    
    return response.data;
}

export const getQuizInfo = async (id: number) => {
    let response = await Axios.get<Quiz>(`${apiAddress}/quiz/${id}`);

    return response.data;
}