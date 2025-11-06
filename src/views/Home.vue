
<script setup lang="ts">
import { useAuthStore } from "@stores/auth";

const authStore = useAuthStore();
</script>

<template>
  <div class="home">
    <h1>Bem-vindo ao Sistema de Agenda</h1>
    
    <div v-if="authStore.isAuthenticated" class="authenticated">
      <p>Você está logado como {{ authStore.user?.name }}</p>
      <router-link to="/dashboard" class="btn">Ir para Dashboard</router-link>
    </div>
    
    <div v-else class="unauthenticated">
      <p>Faça login para acessar o sistema</p>
      <div class="actions">
        <router-link to="/login" class="btn">Login</router-link>
        <router-link to="/register" class="btn btn-secondary">Registrar</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #545b62;
}
</style>