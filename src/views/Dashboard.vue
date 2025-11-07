<script setup lang="ts">
import ContactForm from "@components/ContactForm.vue";
import Modal from "@components/Modal.vue";
import type { Contact } from "@interfaces/contact";
import { useContactsStore } from "@stores/contact";
import { useDebounceFn } from "@vueuse/core"
import { computed, onMounted, ref } from "vue";
import { PhX, PhPencil, PhTrash, PhUserCirclePlus, PhArrowsClockwise } from "@phosphor-icons/vue";
import Paginator from "@components/Paginator.vue";
import maskPhone from "@utils/mask-phone";
import SwipeReveal from "@components/SwipeReveal.vue";
import AppHeader from "@components/AppHeader.vue";

const contacts = useContactsStore();

const debouncedSet = useDebounceFn((v: string) => {
    contacts.setSearch(v);
}, 300);

const showCreate = ref(false);
const showEdit = ref(false);
const showDelete = ref(false);
const editingId = ref<number | null>(null);
const deletingId = ref<number | null>(null);
const actionLoading = ref(false);
const actionError = ref<string | null>(null);

const isMobile = ref(false);
onMounted(() => {
    const ua = (navigator.userAgent || navigator.vendor || (window as any).opera || "").toLowerCase();
    const mobileDimensions = window.innerWidth <= 480;
    isMobile.value =
        /(android|iphone|ipad|ipod|blackberry|iemobile|opera mini)/i.test(ua)
        || mobileDimensions;
});

const searchPlaceholder = computed(() =>
    isMobile.value ? "Buscar..." : "Buscar por nome, e-mail ou telefone"
);

onMounted(() => {
    contacts.fetchAll({ force: true });
});

function onRetry() {
    contacts.fetchAll({ force: true });
}

function onPageChange(p: number) {
    contacts.goTo(p);
}

function openCreate() {
    actionError.value = null;
    showCreate.value = true;
}

function openEdit(id: number) {
    actionError.value = null;
    editingId.value = id;
    showEdit.value = true;
}

function openDelete(id: number) {
    actionError.value = null;
    deletingId.value = id;
    showDelete.value = true;
}

async function handleCreate(payload: Omit<Contact, "id">) {
    actionLoading.value = true;
    actionError.value = null;

    try {
        await contacts.create(payload);
        showCreate.value = false;
        onRetry();
    } catch (error: any) {
        actionError.value = error.message || "Erro ao criar contato";
    } finally {
        actionLoading.value = false;
    }
}

async function handleUpdate(payload: { name: string; phone: string; email?: string; photo?: File }) {
    if (!editingId.value) return;
    actionLoading.value = true;
    actionError.value = null;

    try {
        await contacts.update(editingId.value, payload);
        showEdit.value = false;
        editingId.value = null;
    } catch (e: any) {
        actionError.value = e.message || "Erro ao atualizar contato";
    } finally {
        actionLoading.value = false;
    }
}

async function handleDelete() {
    if (!deletingId.value) return;
    actionLoading.value = true;
    actionError.value = null;

    try {
        await contacts.remove(deletingId.value);
        showDelete.value = false;
        onRetry();
    } catch (e: any) {
        actionError.value = e.message || "Erro ao excluir contato";
    } finally {
        actionLoading.value = false;
    }
}



const editingContact = computed(() =>
    editingId.value ? contacts.list.find(c => c.id === editingId.value) : undefined
);

</script>

<template>
    <div class="dashboard">
        <AppHeader />

        <main class="contacts">
            <div class="toolbar">
                <input class="search" type="search" :placeholder="searchPlaceholder"
                    @input="debouncedSet(($event.target as HTMLInputElement).value)" />
                <button @click="onRetry" :disabled="contacts.loading" title="Atualizar" aria-label="Atualizar lista">
                    <PhArrowsClockwise :size="20" />
                </button>
                <button class="add-button" @click="openCreate" title="Criar contato" aria-label="Criar contato">
                    <PhUserCirclePlus :size="20" />
                </button>
            </div>

            <div v-if="contacts.loading" class="skeleton">
                Carregando contatos...
            </div>

            <div v-else-if="contacts.error" class="error">
                {{ contacts.error }}
            </div>

            <div v-else-if="!contacts.list.length" class="empty">
                Nenhum contato encontrado.
            </div>

            <ul v-else class="list">
                <SwipeReveal
                    v-for="c in contacts.list"
                    :key="c.id"
                    :action-width="96"
                    class="item"
                >
                    <template #default>
                        <img v-if="c.photo_url" :src="c.photo_url" class="avatar-img" />
                        <div v-else class="avatar">{{ c.name[0] }}</div>
                        <div class="meta">
                        <strong>{{ c.name }}</strong>
                        <small>{{ c.email || "—" }}</small>
                        <small>{{ maskPhone(c.phone) }}</small>
                        </div>
                    </template>

                    <template #actions>
                        <button class="icon-btn" type="button" @click.stop="openEdit(c.id)" aria-label="Editar contato">
                            <PhPencil :size="20" />
                        </button>
                        <button class="icon-btn danger" type="button" @click.stop="openDelete(c.id)" aria-label="Excluir contato">
                            <PhTrash :size="20" />
                        </button>
                    </template>
                </SwipeReveal>
            </ul>

            <Paginator
                :page="contacts.currentPage"
                :total-pages="contacts.lastPage"
                :loading="contacts.loading"
                @change="onPageChange"
            />
        </main>
    </div>

    <Modal :open="showCreate" @close="showCreate = false">
        <template #header>
            <div class="modal-header custom-header">
                <span class="modal-title">Criar contato</span>
                <button type="button" @click="showCreate = false" :disabled="actionLoading" class="close-btn"
                    aria-label="Fechar">
                    <PhX :size="20" color="#636363" />
                </button>
            </div>
        </template>
        <ContactForm :loading="actionLoading" submit-label="Criar" @submit="handleCreate" />
        <div v-if="actionError" class="inline-error">{{ actionError }}</div>
    </Modal>

    <Modal :open="showEdit" @close="showEdit = false">
        <template #header>
            <div class="modal-header custom-header">
                <span class="modal-title">Editar contato</span>
                <button type="button" @click="showEdit = false" :disabled="actionLoading" class="close-btn"
                    aria-label="Fechar">
                    <PhX :size="20" color="#636363" />
                </button>
            </div>
        </template>
        <ContactForm :initial="editingContact" :loading="actionLoading" submit-label="Salvar" @submit="handleUpdate" />
        <div v-if="actionError" class="inline-error">{{ actionError }}</div>
    </Modal>

    <Modal :open="showDelete" @close="showDelete = false">
        <template #header>
            <div class="modal-header custom-header">
                <span class="modal-title">Deseja excluir este contato?</span>
                <button type="button" @click="showDelete = false" :disabled="actionLoading" class="close-btn"
                    aria-label="Fechar">
                    <PhX :size="20" color="#636363" />
                </button>
            </div>
        </template>
        <div class="delete-buttons">
            <button @click.stop="handleDelete" :disabled="actionLoading" style="background-color: red;">
                Sim, excluir
            </button>
            <button @click="showDelete = false" :disabled="actionLoading">
                Cancelar
            </button>
        </div>
        <div v-if="actionError" class="inline-error">{{ actionError }}</div>
    </Modal>
</template>

<style src="@styles/icon-btn.css" scoped></style>

<style scoped>
.dashboard {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.contacts {
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    gap: 0.75rem;
    text-align: start;
    flex: 1;
}

.toolbar {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
}

.toolbar button {
    padding: .6rem .9rem;
    background: #007bff;
    border: none;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.toolbar .add-button {
    background-color: #00705A;
    padding-block: 0.6rem;
}

.toolbar button:disabled {
    background: #777;
}

.search {
    flex: 1;
    padding: 0.75rem;
    border-radius: 8px;
    outline: none;
    border: none;
    color: #636363;
    background-color: #f3f3f3;
    min-width: 200px;
}

.list {
    list-style: none;
    display: grid;
    gap: 0.5rem;
    padding: 0;
    margin: 0;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #007bff;
    color: #fff;
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: .95rem;
}

.avatar-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.meta {
    display: grid;
    gap: 2px;
    min-width: 0;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #007bff;
    color: #fff;
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: .95rem;
}

.meta {
    display: grid;
    gap: 2px;
}

.inline-error {
    margin: .75rem 1rem 0;
    color: #b00020;
    background: #ffecec;
    padding: .5rem .75rem;
    border-radius: 6px;
    font-size: .875rem;
}

.skeleton {
    color: #FFF;
}

.error {
    color: red;
    background: #fee;
    border-radius: 6px;
    padding: 0.75rem;
}

.empty {
    color: #fff;
}

.modal-title {
    font-weight: 600;
    font-size: 18px;
}

.custom-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1rem 1.25rem;
}

.delete-buttons {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.close-btn {
    background: transparent;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    line-height: 1;
    padding: 0;
}
</style>
