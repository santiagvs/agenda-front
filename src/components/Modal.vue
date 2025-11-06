<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { PhX } from "@phosphor-icons/vue";

const { open } = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: "close"): void }>();

const panel = ref<HTMLElement | null>(null);
const titleId = `modal-title-${Math.random().toString(36).slice(2)}`;

function emitClose() {
    emit("close");
}

function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") emitClose();
}

onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
    <teleport to="body">
        <div v-if="open" class="modal-backdrop" @click.self="emitClose">
            <div class="modal" role="dialog" aria-modal="true" :aria-labelledby="titleId" ref="panel">
                <header class="modal-header">
                    <slot name="header">
                        <h2 :id="titleId" class="modal-title">
                            <slot name="title" />
                        </h2>
                        <button class="close-btn" type="button" @click="emitClose" aria-label="Fechar">
                            <PhX :size="20" />
                        </button>
                    </slot>
                </header>
                <section class="modal-body">
                    <slot />
                </section>
                <footer class="modal-footer">
                    <slot name="footer" />
                </footer>
            </div>
        </div>
    </teleport>
</template>


<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
  padding: 2rem 1rem;
  z-index: 1000;
  overflow: auto;
}


.modal {
    background: #fff;
    color: #222;
    width: 100%;
    max-width: 480px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 90dvh;
    box-sizing: border-box;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
}

.modal-body {
    padding: 1rem 1rem 0.5rem;
    display: grid;
    gap: .75rem;
    flex: 1 1 auto;
    overflow: auto;
}

.modal-footer {
    padding: 0.75rem 1rem 0.75rem;
    display: flex;
    justify-content: flex-end;
    gap: .5rem;
}
</style>