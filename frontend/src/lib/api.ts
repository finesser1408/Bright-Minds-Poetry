import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/auth';
const API_PUBLIC = 'http://127.0.0.1:8000/api';

export const login = async (identifier: string, password: string) => {
  // Backend expects 'username' which can be either username or email
  return axios.post(`${API_BASE}/login/`, { username: identifier, password });
};

export const register = async (data: {
  username: string;
  email: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
}) => {
  return axios.post(`${API_BASE}/registration/`, data);
};

export const logout = async () => {
  return axios.post(`${API_BASE}/logout/`);
};

export const getUser = async () => {
  return axios.get(`${API_BASE}/user/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
};

export const fetchPoems = async (author?: string) => {
  let url = `${API_PUBLIC}/poems/`;
  if (author) {
    url += `?author=${encodeURIComponent(author)}`;
  }
  return axios.get(url);
};

// Likes API
export const fetchLikes = async (poemId?: number) => {
  let url = `${API_PUBLIC}/likes/`;
  if (poemId) url += `?poem=${poemId}`;
  return axios.get(url);
};

export const postLike = async (poemId: number, user: string) => {
  return axios.post(`${API_PUBLIC}/likes/`, { poem: poemId, user });
};

// Comments API
export const fetchComments = async (poemId?: number) => {
  let url = `${API_PUBLIC}/comments/`;
  if (poemId) url += `?poem=${poemId}`;
  return axios.get(url);
};

export const postComment = async (poemId: number, user: string, content: string) => {
  return axios.post(`${API_PUBLIC}/comments/`, { poem: poemId, user, content });
};

// Community Highlights
export const fetchCommunityHighlights = async () => {
  return axios.get(`${API_PUBLIC}/highlights/`);
};
