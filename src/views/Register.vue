<script setup lang="ts">
import { useAuthStore } from '@stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const successMessage = ref("");

const handleRegister = async () => {
  const result = await authStore.register(
    name.value,
    email.value,
    password.value,
    passwordConfirmation.value
  );

  if (result.success) {
    successMessage.value = "Registro realizado com sucesso! Redirecionando para login...";
    setTimeout(() => router.push("/login"), 2000);
  }
};
</script>

<template>
  <div class="register-container">
    <h2 style="color: #444;">Registro</h2>

    <form class="register-form" @submit.prevent="handleRegister" novalidate>
      <div class="form-group">
        <label for="name">Nome:</label>
        <input
          id="name"
          type="text"
          v-model="name"
          required
          :disabled="authStore.loading"
          @input="authStore.clearError"
          placeholder="Seu nome"
        />
      </div>

      <div class="form-group">
        <label for="email">E-mail:</label>
        <input
          id="email"
          type="email"
          v-model="email"
          required
          :disabled="authStore.loading"
          @input="authStore.clearError"
          placeholder="voce@exemplo.com"
        />
      </div>

      <div class="form-group">
        <label for="password">Senha:</label>
        <input
          id="password"
          type="password"
          v-model="password"
          required
          :disabled="authStore.loading"
          @input="authStore.clearError"
          placeholder="********"
        />
      </div>

      <div class="form-group">
        <label for="passwordConfirmation">Confirmar senha:</label>
        <input
          id="passwordConfirmation"
          type="password"
          v-model="passwordConfirmation"
          required
          :disabled="authStore.loading"
          @input="authStore.clearError"
          placeholder="********"
        />
      </div>

      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? "Registrando..." : "Registrar" }}
      </button>

      <div class="error" v-if="authStore.error">
        {{ authStore.error }}
      </div>

      <div class="success" v-if="successMessage">
        {{ successMessage }}
      </div>

      <p>
        Já tem conta?
        <router-link to="/login">Fazer login</router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>
.register-container {
  width: 100%;
  max-width: 420px;
  margin: 0 1rem;
  padding: 2rem;
  background-color: #ffffff;
  color: #222;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
}

.register-form {
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

.success {
  color: green;
  padding: 0.5rem;
  background-color: #efe;
  border-radius: 4px;
}

@media (max-width: 480px) {
  .register-container {
    padding: 1.5rem;
    border-radius: 8px;
  }
  button {
    font-size: 16px;
  }
}
</style>
