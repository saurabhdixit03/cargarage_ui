import axios from "axios";
import { ADMIN_API_BASE_URL, USER_API_BASE_URL } from '../utils/constants';

export const adminApiClient = axios.create({
  baseURL: ADMIN_API_BASE_URL, // Change based on your backend URL
  withCredentials: true,  // ✅ Ensures JSESSIONID is included in requests
});

export const userApiClient = axios.create({
  baseURL: USER_API_BASE_URL, // Change based on your backend URL
  withCredentials: true,  // ✅ Ensures JSESSIONID is included in requests
});


