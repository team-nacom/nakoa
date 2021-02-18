import dotenv from 'dotenv';

dotenv.config();

export default {
    adminEmail: process.env.ADMIN_EMAIL || 'nacommanager@gmail.com',
    apiAddress: process.env.API_ADDRESS || 'http://localhost:3885',
}