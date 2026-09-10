import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/cart`;

// Get cart
export const getCart = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Add item to cart
export const addToCart = async (
  menuItemId,
  quantity = 1
) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    {
      menuItemId,
      quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Update quantity
export const updateCartItem = async (
  menuItemId,
  quantity
) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${menuItemId}`,
    {
      quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Remove item
export const removeFromCart = async (menuItemId) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${API_URL}/${menuItemId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Clear cart
export const clearCart = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};