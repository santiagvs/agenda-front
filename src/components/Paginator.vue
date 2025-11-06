<script setup lang="ts">
import { PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue";

const props = defineProps<{
    page: number;
    totalPages: number;
    loading?: boolean;
    disabled?: boolean;
}>();
const emit = defineEmits<{
    (e: "change", page: number): void;
}>();

function to(p: number) {
    if (p < 1 || p > props.totalPages) return;
    emit("change", p);
}

const windowSize = 5;
function pagesWindow() {
    const start = Math.max(1, props.page - Math.floor(windowSize / 2));
    const end = Math.min(props.totalPages, start + windowSize - 1);
    const finalStart = Math.max(1, end - windowSize + 1);
    const arr: number[] = [];
    for (let i = finalStart; i <= end; i++) arr.push(i);
    return arr;
}
</script>

<template>
    <nav class="paginator" aria-label="Paginação" v-if="totalPages > 1">
        <button
            class="pg-btn"
            :disabled="loading || disabled || page <= 1"
            @click="to(page - 1)"
            aria-label="Página anterior"
        >
            <PhCaretLeft :size="20"/>
        </button>

        <button v-for="p in pagesWindow()" :key="p" class="pg-btn" :class="{ active: p === page }"
            :disabled="loading || disabled" @click="to(p)">{{ p }}</button>

        <button
            class="pg-btn"
            :disabled="loading || disabled || page >= totalPages"
            @click="to(page + 1)"
            aria-label="Próxima página"
        >
            <PhCaretRight :size="20" />
        </button>
    </nav>
</template>

<style scoped>
.paginator {
    display: flex;
    gap: .4rem;
    justify-content: center;
    flex-wrap: wrap;
    padding: .5rem 0;
}

.pg-btn {
    min-width: 36px;
    padding: .45rem .6rem;
    background: #eef2f7;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: .85rem;
    color: #2f3a48;
    transition: background .15s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pg-btn:hover:not(:disabled) {
    background: #dbe4ec;
}

.pg-btn:disabled {
    opacity: .45;
    cursor: not-allowed;
}

.pg-btn.active {
    background: #007bff;
    color: #fff;
    font-weight: 600;
}
</style>