<script setup lang="ts">
import { reactive } from "vue";
import type { Contact } from "@interfaces/contact";

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

function onFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) local.photo = file;
}

function onSubmit() {
  emit("submit", {
    name: local.name.trim(),
    phone: local.phone.trim(),
    email: local.email.trim() || undefined,
    photo: local.photo,
  });
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="contact-form">
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

    <div class="form-group">
      <label for="photo">Foto (opcional)</label>
      <input id="photo" type="file" accept="image/*" @change="onFile" />
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
</style>