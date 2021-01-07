import dotenv from 'dotenv';

dotenv.config();

export default {
    apiAddress: process.env.API_ADDRESS || 'http://localhost:3885',
}