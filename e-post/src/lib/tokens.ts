const AUTH_TOKEN_KEY = 'jwtToken';

export const setToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};
