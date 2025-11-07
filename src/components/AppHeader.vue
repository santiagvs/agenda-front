<script setup lang="ts">
import { useAuthStore } from "@stores/auth";
import { useRouter } from "vue-router";
import Brand from "@components/Brand.vue";
import { PhSignOut } from "@phosphor-icons/vue";

const auth = useAuthStore();
const router = useRouter();

function handleLogout() {
    auth.logout();
    router.push("/login");
}
</script>

<template>
    <header class="app-header">
        <Brand font-size="3.5rem" :size="36" accent="#0a66ff" color="#111" />
        <div class="right">
            <span>Olá, <b>{{ auth.user?.name }}</b></span>
            <button class="logout-btn" type="button" @click="handleLogout" title="Sair">
                <PhSignOut :size="20" />
            </button>
        </div>
    </header>
</template>

<style src="@styles/header.css" scoped></style>
