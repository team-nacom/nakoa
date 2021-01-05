import Axios from 'axios';

const apiAddress = 'http://localhost:3885';

export interface Chall {
    _id: string;
    index: number;
    name: string;
}

export const getChallList = async () => {
    let response = await Axios.get<Chall[]>(`${apiAddress}/chall`);

    console.log(response);
    if (response.status === 200) return response.data;
    else return [];
}