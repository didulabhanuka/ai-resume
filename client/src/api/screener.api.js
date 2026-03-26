import api from './axios';

export const screenResume = (formData) =>
  api.post('/screener/screen', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });