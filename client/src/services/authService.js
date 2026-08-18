import api, { API_BASE_URL } from "../api/axios";

//---->>>> REGISTER

export const registerUser = async ({ name, email, password }) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
};

//----->>>> LOGIN

export const loginUser = async ({ email, password }) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

//----->>>> GET CURRENT USER

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

//------->>>> LOGOUT

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};

//----->>> GOOGLE LOGIN

export const loginWithGoogle = () => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};
