import axios from "axios";
import { getToken, clearToken } from "@/lib/auth-token";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.ajora.ng/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor — attach the admin JWT (for 🔒 bearerAuth endpoints).
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor — on 401, drop the stale session and bounce to login.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      clearToken();
      // Avoid redirect loops if we're already on the login screen.
      // NOTE: point this at the real admin login route once that screen exists.
      if (!window.location.pathname.includes("/login")) {
        window.location.assign("/auth/admin/login");
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
