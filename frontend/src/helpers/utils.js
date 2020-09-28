const prod = 'http://localhost';
const dev = 'http://localhost';

export const API_URL = process.env.NODE_ENV === 'development' ? dev : prod;