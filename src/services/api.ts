import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt_token");
    if (token)
        config.headers.Authorization = `Bearer ${token}`;

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const reqUrl = error.config?.url || "";

        if (status === 401) {
            if (!reqUrl.includes("/login") && !reqUrl.includes("/register")) {
                localStorage.removeItem("jwt_token");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);
export default api;