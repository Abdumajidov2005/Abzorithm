export const setToken = (token) => {
  window.localStorage.setItem("Coding", token);
};

export const getToken = () => {
  return window.localStorage.getItem("Coding");
};
