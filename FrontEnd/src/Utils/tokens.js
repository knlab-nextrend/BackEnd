const getToken = () => {
  if (!!localStorage.getItem("token")) {
    return localStorage.getItem("token");
  }
};
const getRefreshToken = () => {
  if (!!localStorage.getItem("refreshToken")) {
    return localStorage.getItem("refreshToken");
  }
};

const setTokens = (res) => {
  return new Promise((resolve, reject) => {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    resolve(null);
  });
};
export { getToken, getRefreshToken, setTokens };
