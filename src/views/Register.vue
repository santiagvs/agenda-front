<script setup lang="ts">
import { useAuthStore } from "@stores/auth";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppInput from "@components/AppInput.vue";
import isEmailValid from "@utils/is-email-valid";
import { PhEye, PhEyeSlash } from "@phosphor-icons/vue";
import Brand from "@components/Brand.vue";

const authStore = useAuthStore();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const successMessage = ref("");

const isPasswordVisible = ref(false);
const isPasswordConfirmationVisible = ref(false);

const emailOk = computed(() => isEmailValid(email.value));
const nameOk = computed(() => !!name.value.trim());

const isPasswordValid = computed(() =>
    /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password.value)
);
const passwordsMatch = computed(() => password.value === passwordConfirmation.value);
const pwdOk = computed(() => isPasswordValid.value && passwordsMatch.value);
const canSubmit = computed(() => nameOk.value && emailOk.value && pwdOk.value && !authStore.loading);

async function handleRegister() {
    if (!canSubmit.value) return;
    const result = await authStore.register(name.value, email.value, password.value, passwordConfirmation.value);
    if (result.success) {
        successMessage.value = "Registro realizado com sucesso! Redirecionando para login...";
        setTimeout(() => router.push("/login"), 2000);
    }
};
</script>

<template>
    <main class="page-center">
        <div class="register-container">
            <div class="brand" style="margin: 0 auto; width: 50%; padding-bottom: 1rem;">
                <Brand font-size="2rem" :size="40" accent="#0a66ff" color="#111" />
            </div>
            <form class="register-form" @submit.prevent="handleRegister" novalidate>
                <AppInput id="name" label="Nome:" v-model="name" required :disabled="authStore.loading" />
                <AppInput id="email" label="E-mail:" type="email" v-model="email" required
                    :disabled="authStore.loading" />

                <div class="form-group">
                    <label for="password">Senha:</label>
                    <div class="password">
                        <input
                            id="password"
                            :type="isPasswordVisible ? 'text' : 'password'"
                            v-model="password"
                            required
                            :disabled="authStore.loading"
                            :class="{ invalid: password.length > 0 && !isPasswordValid }"
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
                    <small v-if="password.length > 0 && !isPasswordValid" class="field-error">
                        A senha deve ter ao menos 8 caracteres, incluindo letras e números.
                    </small>
                </div>

                <div class="form-group password">
                    <label for="passwordConfirmation">Confirmar senha:</label>
                    <div class="password">
                        <input
                            id="passwordConfirmation"
                            :type="isPasswordConfirmationVisible ? 'text' : 'password'"
                            v-model="passwordConfirmation"
                            required
                            :disabled="authStore.loading"
                            :class="{ invalid: passwordConfirmation.length > 0 && !passwordsMatch }"
                            @input="authStore.clearError"
                        />
                        <button
                            type="button"
                            class="toggle-btn"
                            @click="isPasswordConfirmationVisible = !isPasswordConfirmationVisible"
                        >
                            <PhEye :size="18" color="#111111" v-if="!isPasswordConfirmationVisible" />
                            <PhEyeSlash :size="18" color="#111111" v-else />
                        </button>
                    </div>
                    <small v-if="passwordConfirmation.length > 0 && !passwordsMatch" class="field-error">
                        A confirmação deve ser igual à senha.
                    </small>
                </div>

                <button type="submit" :disabled="!canSubmit">
                    {{ authStore.loading ? "Registrando..." : "Registrar" }}
                </button>

                <div class="error" v-if="authStore.error">{{ authStore.error }}</div>
                <div class="success" v-if="successMessage">{{ successMessage }}</div>
                <span>Já tem conta? <router-link to="/login">Fazer login</router-link></span>
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

.register-container {
    width: 100%;
    max-width: 420px;
    margin: 0 1rem;
    padding: 2rem;
    background-color: #ffffff;
    color: #222;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
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

.field-error {
    font-size: 10   px;
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
