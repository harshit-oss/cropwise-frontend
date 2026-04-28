import axios from "axios";

const API_URL = "https://cropwise-backend-mtvf.onrender.com";

const api = axios.create({
  baseURL: API_URL
});

export const predictCrop = (data) =>
  api.post("/api/predict-crop", data);

export const predictFertilizer = (data) =>
  api.post("/api/predict-fertilizer", data);

export const chat = (data) =>
  api.post("/api/chat", data);