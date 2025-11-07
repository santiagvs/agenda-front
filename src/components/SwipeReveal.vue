<script setup lang="ts">
import { ref } from "vue";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
    actionWidth?: number;
    threshold?: number;
}>(), {
    actionWidth: 120,
    threshold: 0.35,
});

const reveal = ref(0);
const dragging = ref(false);
let startX = 0;
let startY = 0;
let openAtStart = 0;

function onPointerDown(e: PointerEvent) {
    dragging.value = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startX = e.clientX;
    startY = e.clientY;
    openAtStart = reveal.value;
}

function onPointerMove(e: PointerEvent) {
    if (!dragging.value) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.abs(dx) < Math.abs(dy) && Math.abs(dy) > 8) return;

    const next = Math.min(props.actionWidth, Math.max(0, openAtStart - dx));
    reveal.value = next;
}

function onPointerUp() {
    if (!dragging.value) return;
    dragging.value = false;

    const open = reveal.value >= props.actionWidth * props.threshold;
    reveal.value = open ? props.actionWidth : 0;
}
</script>

<template>
    <li class="item" v-bind="$attrs" :style="{
        '--actions-w': props.actionWidth + 'px',
        '--reveal': reveal + 'px',
        '--drag': reveal + 'px'
    }" @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp" @pointercancel="onPointerUp"
        @pointerleave="onPointerUp">
        <div class="item-main">
            <slot />
        </div>
        <div class="item-actions">
            <slot name="actions" />
        </div>
    </li>
</template>

<style src="@styles/contact-item.css" scoped></style>