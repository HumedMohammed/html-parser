import { type BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { request } from "@/utils/api";
import type { AxiosError, AxiosRequestConfig } from "axios";

const axiosBaseQuery =
  (): BaseQueryFn<AxiosRequestConfig> => async (config) => {
    try {
      const result = await request(config);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data,
        },
      };
    }
  };
// initialize an empty api service that we'll inject endpoints into later as needed
export const rootServiceApi = createApi({
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: ["get-user", "get-templates", "get-single-template"],
  refetchOnReconnect: true,
});
