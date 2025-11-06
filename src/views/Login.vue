<script setup lang="ts">
import { useAuthStore } from '@stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");

const handleLogin = async () => {
    const result = await authStore.login(email.value, password.value);

    if (result.success) router.push("/dashboard");
};
</script>

<template>
    <div class="login-container">
        <h2 style="color: #444;">Login</h2>
        <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
                <label for="email">E-mail:</label>
                <input
                    type="email"
                    id="email"
                    v-model="email"
                    required
                    :disabled="authStore.loading"
                    @input="authStore.clearError"
                />
            </div>

            <div class="form-group">
                <label for="password">Senha:</label>
                <input
                    type="password"
                    id="password"
                    v-model="password"
                    required
                    :disabled="authStore.loading"
                    @input="authStore.clearError"
                />
            </div>

            <button
                type="submit"
                :disabled="authStore.loading"
            >
                {{ authStore.loading ? "Entrando..." : "Entrar" }}
            </button>

            <div class="error" v-if="authStore.error">
                {{ authStore.error }}
            </div>

            <span>
                Não tem conta?
                <router-link to="/register">Registrar</router-link>
            </span>
        </form>
    </div>
</template>

<style scoped>
.login-container {
  min-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #FFF;
  border-radius: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
}

button {
  padding: 0.75rem;
  background-color: #007bff;
  font-size: 18px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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