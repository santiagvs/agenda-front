<script setup lang="ts">
import { useAuthStore } from "@stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Brand from "@components/Brand.vue";
import { PhEye, PhEyeSlash } from "@phosphor-icons/vue";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");

const isPasswordVisible = ref(false);

const handleLogin = async () => {
    const result = await authStore.login(email.value, password.value);
    if (result.success) router.push("/dashboard");
};
</script>

<template>
    <main class="page-center">
        <div class="login-container">
            <div class="brand" style="margin: 0 auto; width: 50%; padding-bottom: 1rem;">
                <Brand font-size="2rem" :size="40" accent="#0a66ff" color="#111" />
            </div>
            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label for="email">E-mail:</label>
                    <input id="email" type="email" v-model="email" required :disabled="authStore.loading"
                        @input="authStore.clearError" />
                </div>
                <div class="form-group">
                    <label for="password">Senha:</label>
                    <div class="password">
                        <input
                            id="password"
                            :type="isPasswordVisible ? 'text' : 'password'"
                            v-model="password"
                            required
                            :disabled="authStore.loading"
                            :class="{ invalid: password.length > 0 }"
                            @input="authStore.clearError"
                        />
                        <button
                            type="button"
                            class="toggle-btn"
                            @click="isPasswordVisible = !isPasswordVisible"
                        >
                            <PhEye :size="18" color="#111111" v-if="!isPasswordVisible" />
                            <PhEyeSlash :size="18" color="#111111" v-else />
                        </button>
                    </div>
                </div>
                <button type="submit" :disabled="authStore.loading">
                    {{ authStore.loading ? "Entrando..." : "Entrar" }}
                </button>
                <div class="error" v-if="authStore.error">{{ authStore.error }}</div>
                <span>Não tem conta? <router-link to="/register">Registrar</router-link></span>
            </form>
        </div>
    </main>
</template>

<style scoped>
.page-center {
    min-height: 100dvh;
    display: grid;
    place-items: center;
}

.login-container {
    width: 100%;
    max-width: 420px;
    margin: 0 1rem;
    padding: 2rem;
    background-color: #FFF;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
}

button {
    padding: 0.75rem;
    background-color: #282C35;
    font-size: 18px;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: 300ms ease-in-out;
}

button:hover {
    background-color: #282c3567;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.password {
    position: relative;
    width: 100%;
}

.toggle-btn {
    position: absolute;
    bottom: -4.5px;
    right: 0.4rem;
    background-color: transparent;
    outline: none;
    transition: none;
}

.toggle-btn:hover {
    background-color: transparent;
}

.error {
    color: red;
    padding: 0.5rem;
    background-color: #fee;
    border-radius: 4px;
}

@media (max-width: 480px) {
    .login-container {
        padding: 1.5rem;
        border-radius: 8px;
    }

    button {
        font-size: 16px;
    }
}
</style>