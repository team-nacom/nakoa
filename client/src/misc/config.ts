import dotenv from 'dotenv';

dotenv.config();

const config = {
    adminEmail: 'nacommanager@gmail.com',
    apiAddress: process.env.REACT_APP_API_URL || 'http://localhost:3885',
    googleAnalyticsTrackingId: process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID || '',
}

export default config;
