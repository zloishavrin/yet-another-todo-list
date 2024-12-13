import axios from 'axios';

export const baseURL = "http://localhost";

const $api = axios.create({
  withCredentials: true,
  baseURL: baseURL,
});

$api.interceptors.request.use((config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

$api.interceptors.response.use((config) => {
  return config;
}, async (error) => {
  throw error;
});

export default $api;