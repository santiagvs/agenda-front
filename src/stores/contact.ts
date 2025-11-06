import ContactService from "@services/contact-service";
import axios from "axios";
import type { Contact } from "@interfaces/contact";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const service = new ContactService();

function isValidContact(obj: any): obj is Contact {
    return Boolean(obj) 
        && typeof obj.id === "string" 
        && typeof obj.name === "string"
        && typeof obj.phone === "string";
}

export const useContactsStore = defineStore("contacts", () => {
    const byId = ref<Record<string, Contact>>({});
    const ids = ref<string[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const lastFetched = ref<number>(0);
    const STALE_MS = 60_000;

    const list = computed<Contact[]>(() =>
      ids.value.map((id) => byId.value[id]).filter((c): c is Contact => c !== undefined)
    );

    const setError = (message?: string | null) => {
      error.value = message ?? null;
    };

    function normalize(items: Contact[]) {
        const map: Record<string, Contact> = {};
        for (const c of items) map[c.id] = c;
        byId.value = map;
        rebuildIdsSorted();
    }

    function rebuildIdsSorted() {
        ids.value = Object.values(byId.value)
        .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
        .map((c) => c.id);
    }

    async function fetchAll({ force = false, q }: { force?: boolean, q?: string } = {}) {
        if (!force && list.value.length && Date.now() - lastFetched.value < STALE_MS && !q) {
            return;
        }

        loading.value = true;
        setError(null);
        try {
            const items = await service.fetchAll(q ? { q } : undefined);
            normalize(items);
            lastFetched.value = Date.now();
        } catch (err) {
            const msg =
              (axios.isAxiosError(err) && (err.response?.data?.message || err.message)) ||
              (err as Error).message ||
              "Erro ao carregar contatos";
            setError(msg);
        } finally {
            loading.value = false;
        }
    }

    async function create(payload: Omit<Contact, "id">) {
        setError(null);
        const contactCreated = await service.create(payload);
        if (!isValidContact(contactCreated))
            throw new Error("Contato inválido recebido da API");

        byId.value[contactCreated.id] = contactCreated;
        rebuildIdsSorted();
        return contactCreated;
    }

    async function update(id: string, payload: Partial<Omit<Contact, "id">>) {
        setError(null);
        const contactUpdated = await service.update(id, payload);
        if (!isValidContact(contactUpdated))
            throw new Error("Contato inválido atualizado");
        
        byId.value[contactUpdated.id] = contactUpdated;
        rebuildIdsSorted();
        return contactUpdated;
    }

    async function remove(id: string) {
        setError(null);
        try {
            await service.remove(id);
            delete byId.value[id];
            rebuildIdsSorted();
        } catch (e: any) {
            setError(e.message || "Erro ao excluir contato");
            throw e;
        }
    }

    return {
        list,
        loading,
        error,
        setError,
        fetchAll,
        create,
        update,
        remove
    }
});