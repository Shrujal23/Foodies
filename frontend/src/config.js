// Determine API base URL from environment with sensible defaults
// Supports CRA (REACT_APP_) and Vite (VITE_)
const envApiBase =
	(typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) ||
	(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE);

export const API_BASE_URL = (envApiBase || 'http://localhost:5000') + '/api';
export const ASSET_BASE_URL = envApiBase || 'http://localhost:5000';

