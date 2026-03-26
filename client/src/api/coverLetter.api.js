import api from './axios';

export const downloadCoverLetter = (id) =>
  api.get(`/cover-letter/${id}/download`, { responseType: 'blob' });