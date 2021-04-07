import Axios from 'axios';
import store from 'store';
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
    let response = await Axios.post(`${apiAddress}/user/register`, data, { validateStatus: () => true });
    return {
        success: response.status < 300,
        message: response.data as string,
    };
}

const authValidateStatus = (status: number) => ((200 <= status && status < 300) || status === 401);
export interface UserData {
    isAuth: boolean;
    email: string;
    nickname: string;
}

export const setUserInfo = async () => {
    let response = await Axios.get(`${apiAddress}/user`, { validateStatus: authValidateStatus, withCredentials: true });
    let data = response.data as UserData;

    if (data.isAuth) store.dispatch(setUser(data.email, data.nickname));
    else store.dispatch(clearUser());
}

export const isAdmin = () => {
    return store.getState().user?.email === config.adminEmail;
}

export interface LoginData {
    email: string;
    password: string;
}

export const login = async (data: LoginData) => {
    let response = await Axios.post(`${apiAddress}/user/login`, data, { validateStatus: authValidateStatus, withCredentials: true });
    
    if (response.status < 300) await setUserInfo();

    return {
        success: response.status < 300, 
        message: response.data as string,
    };
}

export const logout = async () => {
    let response = await Axios.post(`${apiAddress}/user/logout`, undefined, { validateStatus: authValidateStatus, withCredentials: true });

    if (response.status < 300) await setUserInfo();

    return {
        success: response.status < 300, 
        message: response.data as string,
    };
}

interface GuideType {
    index?: number;
    name: string;
    content: string;
    priority: number;
    isPublic?: boolean;
}

export const getGuides = async () => {
    let response = await Axios.get(`${apiAddress}/guide`);

    return response.data as GuideType[];
}

export const getGuideMaxIndex = async () => {
    let response = await Axios.get(`${apiAddress}/guide/indices`);

    return response.data;
}

export const getGuide = async (id: number) => {
    let response = await Axios.get(`${apiAddress}/guide/${id}`);

    return response.data as GuideType;
}

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

export const removeGuide = async (id: number) => {
    let response = await Axios.delete(`${apiAddress}/guide/${id}`, { withCredentials: true })

    return response.status < 300;
}

//export const postTempGuide = async (data: GuideType) => {
    // This will be written after server-side draft logic is done.
//}