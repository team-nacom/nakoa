import dotenv from 'dotenv';

dotenv.config();

export default {
    adminEmail: process.env.REACT_APP_ADMIN_EMAIL || 'nacommanager@gmail.com',
    apiAddress: process.env.REACT_APP_API_ADDRESS || 'http://localhost:3885',
}