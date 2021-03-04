import dotenv from 'dotenv';

dotenv.config();

export default {
    apiAddress: process.env.API_ADDRESS || 'http://52.78.238.149:3885',
}
