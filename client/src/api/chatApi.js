import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

export const sendChatMessage = async (message, context = {}) => {
  const { data } = await api.post("/chat", { message, context });
  return data;
};

export const getInventorySummary = async () => {
  const { data } = await api.get("/inventory/summary");
  return data;
};

export const getSalesSummary = async () => {
  const { data } = await api.get("/sales/summary");
  return data;
};

export const getStorePerformance = async () => {
  const { data } = await api.get("/sales/store-performance");
  return data;
};

export const getProducts = async () => {
  const { data } = await api.get("/inventory/products");
  return data;
};
