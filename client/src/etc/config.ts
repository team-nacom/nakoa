import dotenv from 'dotenv';

dotenv.config();

export default {
    adminEmail: 'nacommanager@gmail.com',
    apiAddress: process.env.REACT_APP_API_URL || 'http://localhost:3885'
}
