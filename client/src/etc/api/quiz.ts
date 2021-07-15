import Axios from 'axios';
import config from '../config';

const apiAddress = config.apiAddress;

export interface Quiz {
    _id?: string;
    index?: number;
    name: string;
    description: string;
    choices: string[];
    answer: string;
    explanation: string;
    createDate?: number;
}

export const getQuizList = async () => {
    let response = await Axios.get<Quiz[]>(`${apiAddress}/quiz`);
    
    return response.data;
}

export const getQuizInfo = async (id: number) => {
    let response = await Axios.get<Quiz>(`${apiAddress}/quiz/${id}`);

    return response.data;
}

export const postQuiz = async (quiz: Quiz) => {
    let response = await Axios.post(`${apiAddress}/quiz`, quiz);
    return response.status < 300;
}
