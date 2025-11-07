<script setup lang="ts">
import { computed } from "vue";
import maskPhone from "@utils/mask-phone";

const props = defineProps<{
    modelValue: string;
    id?: string;
    label?: string;
    type?: "text" | "email" | "password";
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    mask?: "phone" | null;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", v: string): void;
}>();

const inputId = computed(() => props.id || `in-${Math.random().toString(36).slice(2)}`);

const onlyDigits = (s: string) => s.replace(/\D/g, "");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function onInput(e: Event) {
    const el = e.target as HTMLInputElement;
    let v = el.value;
    if (props.mask === "phone") {
        v = maskPhone(onlyDigits(v));
    }
    emit("update:modelValue", v);
}

const isPhone = computed(() => props.mask === "phone");
const phoneDigits = computed(() => onlyDigits(props.modelValue || ""));
const isPhoneValid = computed(() => {
    if (!isPhone.value) return true;
    if (!props.modelValue) return props.required ? false : true;
    return phoneDigits.value.length === 11;
});

const isEmail = computed(() => props.type === "email");
const isEmailValid = computed(() => {
    if (!isEmail.value) return true;
    if (!props.modelValue) return props.required ? false : true;
    return EMAIL_RE.test(props.modelValue.trim());
});

const isInvalid = computed(() => !(isPhoneValid.value && isEmailValid.value));
</script>

<template>
    <div class="form-group">
        <label :for="inputId">{{ label }}</label>
        <input :id="inputId" :type="type || 'text'" :placeholder="placeholder" :disabled="disabled" :required="required"
            :value="modelValue" @input="onInput" :class="{ invalid: isInvalid }" autocomplete="off"
            :inputmode="isPhone ? 'numeric' : 'text'" />
        <small v-if="isPhone && !isPhoneValid" class="field-error">Informe um telefone válido com 11 dígitos.</small>
        <small v-if="isEmail && !isEmailValid && !!modelValue" class="field-error">E-mail inválido.</small>
    </div>
</template>

<style scoped>
.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    text-align: start;
    font-size: 14px;
    margin-bottom: 0.25rem;
}

input.invalid {
    outline: none;
    border: 1px solid #b00020 !important;
}

.field-error {
    color: #b00020;
    margin-top: .25rem;
    display: block;
}
</style>