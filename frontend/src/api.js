import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const loginUser = async (username, password) => {
  return axios.post(`${API_BASE}/api-token-auth/`, { username, password });
};

export const uploadCSV = async (file, token) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_BASE}/api/upload/`, formData, {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getHistory = async (token) => {
  return axios.get(`${API_BASE}/api/history/`, {
    headers: { Authorization: `Token ${token}` },
  });
};
