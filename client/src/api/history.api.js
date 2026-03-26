import api from './axios';

export const getScreenings = (page = 1) =>
  api.get(`/history/screenings?page=${page}`);

export const getScreeningById = (id) =>
  api.get(`/history/screenings/${id}`);

export const deleteScreening = (id) =>
  api.delete(`/history/screenings/${id}`);

export const getCoverLetters = (page = 1) =>
  api.get(`/history/cover-letters?page=${page}`);

export const getCoverLetterById = (id) =>
  api.get(`/history/cover-letters/${id}`);

export const deleteCoverLetter = (id) =>
  api.delete(`/history/cover-letters/${id}`);