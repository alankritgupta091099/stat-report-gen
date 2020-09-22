const prod = 'https://klaviyo-demo.azurewebsites.net';
const dev = 'http://localhost:8080';

export const API_URL = process.env.NODE_ENV === 'development' ? dev : prod;