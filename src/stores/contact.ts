import ContactService from "@services/contact-service";
import axios from "axios";
import type { Contact } from "@interfaces/contact";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const service = new ContactService();

function isValidContact(obj: any): obj is Contact {
    return Boolean(obj)
        && typeof obj.id === "number"
        && typeof obj.name === "string"
        && typeof obj.phone === "string";
}

export const useContactsStore = defineStore("contacts", () => {
    const byId = ref<Record<number, Contact>>({});
    const loading = ref(false);
    const error = ref<string | null>(null);
    const lastFetched = ref<number>(0);

    const currentPage = ref(1);
    const perPage = ref(5);
    const total = ref(0);
    const lastPage = ref(1);
    const search = ref("");

    const pageCache = ref<Record<number, number[]>>({});

    const list = computed<Contact[]>(() => {
        const idsForPage = pageCache.value[currentPage.value] || [];
        return idsForPage.map(id => byId.value[id]).filter((c): c is Contact => c !== undefined);
    });

    async function setSearch(q: string) {
        const term = q.trim();
        if (term === search.value) return;
        search.value = term;
        currentPage.value = 1;
        pageCache.value = {};
        await fetchPage(1);
    }

    const setError = (message?: string | null) => {
        error.value = message ?? null;
    };

    async function fetchPage(page = 1) {
        loading.value = true;
        setError(null);
        try {
            const { items, meta } = await service.fetchAll({
                page,
                per_page: perPage.value,
                q: search.value || undefined
            });

            for (const c of items) if (isValidContact(c)) byId.value[c.id] = c;

            pageCache.value[page] = items.map(c => c.id);

            currentPage.value = meta.current_page;
            perPage.value = meta.per_page;
            total.value = meta.total;
            lastPage.value = meta.last_page;
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

    async function goTo(page: number) {
        if (page < 1 || page > lastPage.value) return;
        if (pageCache.value[page]) {
            currentPage.value = page;
            return;
        }
        await fetchPage(page);
    }

    async function fetchAll({ force = false }: { force?: boolean } = {}) {
        if (!force && pageCache.value[currentPage.value]) return;
        await fetchPage(currentPage.value);
    }

    async function create(payload: Omit<Contact, "id">) {
        setError(null);
        const created = await service.create(payload);
        if (!isValidContact(created)) throw new Error("Contato inválido");
        byId.value[created.id] = created;

        const pageIds = pageCache.value[currentPage.value] || [];
        if (currentPage.value === 1 && pageIds.length < perPage.value) {
            pageCache.value[currentPage.value] = [...pageIds, created.id];
        }
        return created;
    }

    async function update(id: number, patch: Partial<Omit<Contact, "id">>) {
        setError(null);
        const updated = await service.update(id, patch);
        if (!isValidContact(updated)) throw new Error("Contato inválido atualizado");
        byId.value[updated.id] = updated;
        return updated;
    }

    async function remove(id: number) {
        setError(null);
        await service.remove(id);
        delete byId.value[id];
        const pageIds = pageCache.value[currentPage.value] || [];
        pageCache.value[currentPage.value] = pageIds.filter(x => x !== id);
    }


    return {
        list,
        loading,
        error,
        currentPage,
        perPage,
        total,
        lastPage,
        search,
        setSearch,
        fetchAll,
        fetchPage,
        goTo,
        create,
        update,
        remove,
        setError,
    };
});