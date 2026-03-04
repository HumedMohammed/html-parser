import axios, { type AxiosRequestConfig } from "axios";
import { apiPath } from "@/constants";
import { db } from "../pockatbase";

// axios.interceptors.request.use(async (config) => {
//   const token = await authInstance?.currentUser?.getIdToken()
//   config.headers!['Authorization'] = `Bearer ${token}`
//   config.headers!['Content-Type'] = 'application/json'
//   return config
// })

export const request = async (config: AxiosRequestConfig) => {
  const token = await db?.authStore?.token;

  return axios({
    baseURL: `${apiPath}/api`,
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...config.headers,
    },
  })
    .then((res) => res)
    .catch((err) => {
      const status = err?.response?.status;
      const redirectTo = err?.response?.data?.redirectTo;
      const code = err?.response?.data?.code;

      if (
        status === 403 &&
        code === "PLAN_LIMIT_REACHED" &&
        typeof redirectTo === "string"
      ) {
        if (window.location.pathname !== redirectTo) {
          window.location.assign(redirectTo);
        }
      }

      throw err;
    });
};
