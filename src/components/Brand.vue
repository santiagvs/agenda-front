<script setup lang="ts">
import { PhAddressBook } from "@phosphor-icons/vue";

const props = withDefaults(defineProps<{
    label?: string;
    color?: string;
    accent?: string;
    size?: number;
    fontSize?: string;
    weight?: number | string;
    gap?: string;
    fontFamily?: string;
}>(), {
    label: "Agenda",
    color: "#282C35",
    accent: "#0a66ff",
    size: 22,
    fontSize: "1.125rem",
    weight: 700,
    gap: "0.5rem",
    fontFamily: "'Palatino Linotype','Book Antiqua', Palatino, 'Times New Roman', serif",
});
</script>

<template>
    <div class="brand" :style="{
        '--brand-color': props.color,
        '--brand-accent': props.accent,
        '--brand-font-size': props.fontSize,
        '--brand-gap': props.gap,
        '--brand-weight': String(props.weight),
        '--brand-font': props.fontFamily
    }">
        <PhAddressBook :size="size" weight="thin" :color="props.color" />
        <span class="brand-name">{{ props.label }}</span>
    </div>
</template>

<style scoped>
.brand {
    display: inline-flex;
    align-items: center;
    gap: var(--brand-gap, .5rem);
    color: var(--brand-color, #111);
    font-family: var(--brand-font), serif;
    font-weight: var(--brand-weight, 700);
    font-size: var(--brand-font-size, 1.125rem);
    line-height: 1;
    white-space: nowrap;
}

.brand-name {
    letter-spacing: .2px;
    user-select: none;
}
</style>