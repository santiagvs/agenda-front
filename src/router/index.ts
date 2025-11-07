import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@stores/auth";
import Login from "@views/Login.vue";
import Register from "@views/Register.vue";
import Dashboard from "@views/Dashboard.vue";

const routes = [
    { path: "/", redirect: "/login" },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: { requiresGuest: true },
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
        meta: { requiresGuest: true },
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { requiresAuth: true },
    },
    { path: "/:pathMatch(.*)*", redirect: "/login" }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next("/login");
    } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
        next("/dashboard");
    } else {
        next();
    }
});

export default router;