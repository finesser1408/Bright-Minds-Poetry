import axios from 'axios';

const API_ROOT = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const API_BASE = `${API_ROOT}/auth`;
const API_PUBLIC = API_ROOT;

export const apiClient = axios.create({ baseURL: API_ROOT, withCredentials: true });

export const currentCsrfToken = () => {
  const cookie = document.cookie.split('; ').find((item) => item.startsWith('csrftoken='));
  return cookie ? decodeURIComponent(cookie.slice('csrftoken='.length)) : undefined;
};

export const getCsrfToken = async () => {
  const response = await apiClient.get(`${API_ROOT}/csrf/`);
  return response.data.csrfToken as string;
};

const csrfHeaders = async () => ({ 'X-CSRFToken': currentCsrfToken() || await getCsrfToken() });

export const currentAuthHeaders = () => ({ ...(currentCsrfToken() ? { 'X-CSRFToken': currentCsrfToken()! } : {}) });

export const login = async (identifier: string, password: string) =>
  apiClient.post(`${API_BASE}/login/`, { username: identifier, password }, { headers: await csrfHeaders() });

export const register = async (data: {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password1: string;
  password2: string;
}) => apiClient.post(`${API_BASE}/registration/`, data, { headers: await csrfHeaders() });

export const verifyEmail = async (key: string) => apiClient.post(`${API_BASE}/registration/verify-email/`, { key });

export const requestPasswordReset = async (email: string) => apiClient.post(`${API_BASE}/forgot-password/`, { email });

export const resetPassword = async (uid: string, token: string, newPassword1: string, newPassword2: string) =>
  apiClient.post(`${API_BASE}/reset-password/`, { uid, token, new_password1: newPassword1, new_password2: newPassword2 });

export const logout = async () => apiClient.post(`${API_BASE}/logout/`, {}, { headers: await csrfHeaders() });

export const getUser = async () => apiClient.get(`${API_BASE}/user/`);

export const fetchPoems = async (author?: string) =>
  apiClient.get(`${API_PUBLIC}/poems/`, { params: author ? { author } : undefined });

export const createPoem = async (data: FormData) =>
  apiClient.post(`${API_PUBLIC}/poems/`, data, { headers: await csrfHeaders() });

export const updatePoem = async (id: number, data: FormData) =>
  apiClient.patch(`${API_PUBLIC}/poems/${id}/`, data, { headers: await csrfHeaders() });

export const fetchLikes = async (poemId?: number, author?: string) =>
  apiClient.get(`${API_PUBLIC}/likes/`, { params: { ...(poemId ? { poem: poemId } : {}), ...(author ? { poem_author: author } : {}) } });

export const postLike = async (poemId: number, _user?: string) =>
  apiClient.post(`${API_PUBLIC}/likes/`, { poem: poemId }, { headers: await csrfHeaders() });

export const fetchComments = async (poemId?: number) =>
  apiClient.get(`${API_PUBLIC}/comments/`, { params: poemId ? { poem: poemId } : undefined });

export const postComment = async (poemId: number, _user: string, content: string) =>
  apiClient.post(`${API_PUBLIC}/comments/`, { poem: poemId, content }, { headers: await csrfHeaders() });

export const fetchCommunityHighlights = async () => apiClient.get(`${API_PUBLIC}/highlights/`);
