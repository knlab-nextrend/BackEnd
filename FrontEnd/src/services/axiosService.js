import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "Utils/tokens";

const instance = axios.create({
  baseURL: "http://nextrend.kr:5000",
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => ({
    ...config,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
      ...config.headers,
    },
  }),
  (error) => {
    alert(error.message);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    console.groupCollapsed(
      `[${res.status} ${res.config.method}] ${res.config.url}`
    );
    console.log(">>> data", res.data);
    console.groupEnd();

    return res;
  },
  (error) => {
    console.log(`[ Error ] ${error.message}`, error.config);
    return Promise.reject(error.response.data);
  }
);

/**
 *
 * @param {AxiosRequestConfig} props
 * @returns
 */
export const _axios = async (props) => {
  const { data } = await instance(props);
  return { data };
};
