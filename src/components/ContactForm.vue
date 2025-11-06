<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, watch } from "vue";
import type { Contact } from "@interfaces/contact";
import { PhUser } from "@phosphor-icons/vue";

const props = defineProps<{
    initial?: Partial<Contact>;
    loading?: boolean;
    submitLabel?: string;
}>();

const emit = defineEmits<{
    (e: "submit", payload: { name: string; phone: string; email?: string; photo?: File }): void;
}>();

const local = reactive({
    name: props.initial?.name ?? "",
    phone: props.initial?.phone ?? "",
    email: props.initial?.email ?? "",
    photo: undefined as File | undefined,
});

const previewUrl = ref<string | null>(props.initial?.photo_url ?? null);
let previousObjectUrl: string | null = null;

function setPreviewFromFile(file: File) {
    if (previousObjectUrl) URL.revokeObjectURL(previousObjectUrl);
    const url = URL.createObjectURL(file);
    previousObjectUrl = url;
    previewUrl.value = url;
}

function onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) { 
        local.photo = file;
        setPreviewFromFile(file); 
    }
}

function onSubmit() {
    emit("submit", {
        name: local.name.trim(),
        phone: local.phone.trim(),
        email: local.email.trim() || undefined,
        photo: local.photo,
    });
}

onBeforeUnmount(() => {
    if (previousObjectUrl) URL.revokeObjectURL(previousObjectUrl);
});

watch(() => props.initial?.photo_url, (val) => {
    if (val) previewUrl.value = val;
});
</script>

<template>
    <form @submit.prevent="onSubmit" class="contact-form">
        <div class="photo-field">
            <input id="photo" type="file" accept="image/*" class="file-input" @change="onFile" :disabled="loading" />
            <label for="photo" class="photo-picker" :class="{ 'has-image': !!previewUrl }" tabindex="0">
                <img v-if="previewUrl" :src="previewUrl" alt="Foto do contato" class="photo-img" draggable="false" />
                <PhUser v-else :size="48" class="placeholder-icon" aria-hidden="true" />
                <span class="photo-hint">{{ previewUrl ? "Alterar foto" : "Adicionar foto" }}</span>
            </label>
        </div>

        <div class="form-group">
            <label for="name">Nome</label>
            <input id="name" v-model="local.name" required />
        </div>

        <div class="form-group">
            <label for="phone">Telefone</label>
            <input id="phone" v-model="local.phone" required />
        </div>

        <div class="form-group">
            <label for="email">E-mail (opcional)</label>
            <input id="email" type="email" v-model="local.email" />
        </div>

        <slot name="actions">
            <button type="submit" :disabled="loading">
                {{ loading ? "Salvando..." : submitLabel }}
            </button>
        </slot>
    </form>
</template>

<style scoped>
.contact-form {
    display: grid;
    gap: .75rem;
}

.contact-form button {
    margin-top: 0.5rem;
    width: 100%;
    padding: .75rem;
    background: #007bff;
    border: none;
    color: #fff;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
}

.contact-form button:disabled {
    background: #999;
    cursor: not-allowed;
}

.photo-field {
    display: flex;
    justify-content: center;
    margin-bottom: .25rem;
}

.file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
}

.photo-picker {
    cursor: pointer;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: #e5e4e4;
    display: grid;
    place-items: center;
    position: relative;
    outline: none;
    transition: background .2s, box-shadow .2s;
    border: 2px solid transparent;
    user-select: none;
}

.photo-picker:hover {
    background: #a0a0a0;
}

.photo-picker:focus-visible {
    box-shadow: 0 0 0 3px rgba(0, 123, 255, .5);
    border-color: #007bff;
}

.photo-picker.has-image {
    background: #1f1f1f;
}

.photo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    display: block;
    pointer-events: none;
}

.placeholder-icon {
    color: #2e2e2e;
}

.photo-hint {
    position: absolute;
    bottom: -0.65rem;
    left: 50%;
    transform: translate(-50%, 100%);
    font-size: .65rem;
    letter-spacing: .5px;
    text-transform: uppercase;
    font-weight: 600;
    color: #b5b5b5;
    pointer-events: none;
    white-space: nowrap;
}
</style>
