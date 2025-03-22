import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});



export const getLecturers = () => api.get('/lecturers');
export const getLecturer = (id) => api.get(`/lecturers/${id}`);
export const createLecturer = (data) => {
  const formData = new FormData();
  
  for (const key in data) {
    formData.append(key, data[key]);
  }
  
  return axios.post(`${API_URL}/lecturers`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};
export const updateLecturer = (id, data) => {
  const formData = new FormData();
  
  for (const key in data) {
    formData.append(key, data[key]);
  }
  
  return axios.post(`${API_URL}/lecturers/${id}?_method=PUT`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};
export const deleteLecturer = (id) => api.delete(`/lecturers/${id}`);

export default api;