import Axios from 'axios';
import { clearUser, setUser } from 'store/user';
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

export interface RegisterData {
    email: string;
    nickname: string;
    password: string;
}

export const register = async (data : RegisterData) => {
    let response = await Axios.post(`${apiAddress}/user/register`, data);
    return response.status < 300;
}

export interface UserData {
    isAuth: boolean;
    email: string;
    nickname: string;
}

export const setUserInfo = async () => {
    let response = await Axios.get(`${apiAddress}/user`);
    let data = response.data as UserData;

    console.log(data);
    
    if (data.isAuth) setUser(data.email, data.nickname);
    else clearUser();
}

export interface LoginData {
    email: string;
    password: string;
}

export const login = async (data: LoginData) => {
    let response = await Axios.post(`${apiAddress}/user/login`, data, { validateStatus: (status) => ((200 <= status && status < 300) || status === 401) });
    
    if (response.status < 300) await setUserInfo();

    return {
        success: response.status < 300, 
        message: response.data as string,
    };
}

export const logout = async () => {
    let response = await Axios.post(`${apiAddress}/user/logout`, undefined, { validateStatus: (status) => ((200 <= status && status < 300) || status === 401) });

    if (response.status < 300) await setUserInfo();

    return {
        success: response.status < 300, 
        message: response.data as string,
    };
}