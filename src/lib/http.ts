import axios, { AxiosError } from "axios";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Tạm thơi thời lưu token ở localStorage để set up sau này lưu trong memory
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // TODO: refresh token or redirect to login when BE is wired
    }

    return Promise.reject(error);
  }
);
