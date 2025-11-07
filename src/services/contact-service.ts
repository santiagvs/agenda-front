import type { Contact } from "@interfaces/contact";
import api from "./api";
import type { ApiResponse } from "@interfaces/api-response";
import unwrap from "@utils/unwrap";
import type { ApiPagedResponse } from "@interfaces/api-paged-response";

export default class ContactService {
    async fetchAll(params?: { page?: number; per_page?: number; q?: string }) {
        const { data } = 
            await api.get<ApiPagedResponse<Contact[]>>("/contacts", { params });

        if (!data.success) throw new Error(data.message || "Falha ao carregar contatos");

        const items = unwrap<Contact[]>(data);
        return {
            items,
            meta: data.meta,
            links: data.links,
        };
    }

    async create({ name, email, phone, photo }: Omit<Contact, "id">) {
        const fd = new FormData();
        fd.append("name", name);
        fd.append("phone", phone);
        if (email) fd.append("email", email);
        if (photo) fd.append("photo", photo);

        const { data } = await api.post<ApiResponse<Contact>>("/contacts", fd);

        return unwrap<Contact>(data);
    }

    async update(id: number, payload: Partial<Contact>) {
        if (!(payload.photo instanceof File)) {
            const body = { name: payload.name, phone: payload.phone, email: payload.email ?? null };
            return unwrap<Contact>((await api.put<ApiResponse<Contact>>(`/contacts/${id}`, body)).data);
        }

        const fd = new FormData();
        fd.append("_method", "PUT");
        if (payload.name )fd.append("name", payload.name);
        if (payload.phone) fd.append("phone", payload.phone);
        if (payload.email) fd.append("email", payload.email);
        fd.append("photo", payload.photo);

        return unwrap<Contact>((await api.post<ApiResponse<Contact>>(`/contacts/${id}`, fd, {
            headers: { "Content-Type": "multipart/form-data" }
        })).data);
    }

    async remove(id: number) {
        const response =
            await api.delete<Omit<ApiResponse<Contact>, "data">>(`/contacts/${id}`);

        return response.data;
    }
}
