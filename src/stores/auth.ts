import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from "../services/api";

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
        token_type: string;
    };
}

interface ApiError {
    response?: {
        data?: {
        message?: string;
        errors?: Record<string, string[]>;
        };
    };
    message: string;
}

export const useAuthStore = defineStore("auth", () => {
    const token = ref<string | null>(localStorage.getItem("jwt_token"));
    const user = ref<User | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const isAuthenticated = computed(() => Boolean(token.value));

    const setError = (message: string) => {
        error.value = message;
    };

    const clearError = () => {
        error.value = null;
    };

    const login = async (email: string, password: string) => {
        loading.value = true;
        clearError();

        try {
            const response = await api.post<LoginResponse>("/login", {
                email,
                password
            })

            const { user: userData, token: userToken } = response.data.data;

            token.value = userToken;
            user.value = userData;
            localStorage.setItem("jwt_token", userToken);

            return { success: true };   
        } catch (error) {
            const apiError = error as ApiError;
            const message = apiError.response?.data?.message || "Erro no login";
            setError(message);
            return { success: false, error: message };
        } finally {
            loading.value = false;
        }
    };

    const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
        loading.value = true;
        clearError();

        try {
            await api.post("/register", {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            return { success: true };
        }  catch (err) {
            const apiError = err as ApiError;
            const message = apiError.response?.data?.message || apiError.message || "Erro no registro";
            setError(message);
            return { success: false, error: message };
        } finally {
            loading.value = false;
        }
    };

    const fetchUser = async () => {
        if (!token.value) return;

        loading.value = true;
        try {
            const response = await api.get<{ success: boolean, data: User }>("/me");
            user.value = response.data.data;   
        } catch (error) {
            logout();
        } finally {
            loading.value = false;
        }
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem("jwt_token");
        clearError();
    };

    if (token.value && !user.value) fetchUser();

    return {
        token,
        user,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        fetchUser,
        clearError,
    }
});