import Axios from 'axios';
import { useSelector } from 'react-redux';
import store, { RootReducer } from 'store';
import { clearUser, setUser } from 'store/user';
import { authValidateStatus } from '.';
import config from '../config';
import { GuideType } from './guide';

const apiAddress = config.apiAddress;

export const verifyEmail = async (email: string, code: string) => {
    let response = await Axios.get(`${apiAddress}/user/verify/${email}/${code}`);

    console.log(response);
    return response.status === 200;
}

export interface RegisterData {
    email: string;
    nickname: string;
    password: string;
}

export const register = async (data : RegisterData) => {
    let response = await Axios.post(`${apiAddress}/user/register`, data, { validateStatus: () => true });
    console.log(response);
    return {
        success: response.status < 300,
        message: response.data as string,
    };
}

export interface UserData {
    email: string;
    nickname: string;
    guides: GuideType[];
    profile: GuideType;
}

export type UserAuthData = UserData & {
    isAuth: boolean;
}

export const setUserInfo = async () => {
    let response = await Axios.get(`${apiAddress}/user`, { validateStatus: authValidateStatus, withCredentials: true });
    let data = response.data as UserAuthData;

    if (data.isAuth) store.dispatch(setUser(data.email, data.nickname));
    else store.dispatch(clearUser());
}

export const isLoggedIn = () => {
    return store.getState().user.loggedIn;
}

export const useIsLoggedIn = () => {
    let loggedIn = useSelector((state: RootReducer) => state.user.loggedIn);

    return loggedIn;
}

export const isAdmin = () => {
    return store.getState().user?.email === config.adminEmail;
}

export const useIsAdmin = () => {
    let email = useSelector((state: RootReducer) => state.user.email);

    return email === config.adminEmail;
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

export const getMyPage = async() => {
    let response = await Axios.get(`${apiAddress}/user/mypage`, {
        validateStatus: authValidateStatus, 
        withCredentials: true 
    });

    return response.data as UserAuthData;
}

export const getUserProfile = async (nickname: string) => {
    let response = await Axios.get(`${apiAddress}/user/profile/${nickname}`);
    return response.data as UserData;
}