import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/menu-items`;

export const getMenuItems = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

export const createMenuItem = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateMenuItem = async (id, formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteMenuItem = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};