import dotenv from 'dotenv';
dotenv.config();

export const adminEmail = 'nacommanager@gmail.com';
export const baseUrl = process.env.REACT_APP_BASE_URL ?? '/';
export const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:3885';
export const googleAnalyticsTrackingId = process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID ?? '';
