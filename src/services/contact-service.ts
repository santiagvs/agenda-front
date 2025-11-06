import type { Contact } from "@interfaces/contact";
import api from "./api";
import type { ApiResponse } from "@interfaces/api-response";
import unwrap from "@utils/unwrap";

export default class ContactService {
    async fetchAll(params?: { q?: string }) {
        const { data } = 
            await api.get<ApiResponse<Contact[]>>("/contacts", { params });
        return unwrap<Contact[]>(data);
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

    async update(id: number, { name, email, phone, photo }: Partial<Omit<Contact, "id">>) {
        const fd = new FormData();
        if (name) fd.append("name", name);
        if (phone) fd.append("phone", phone);
        if (email) fd.append("email", email);
        if (photo) fd.append("photo", photo);

        const { data } = await api.put<ApiResponse<Contact>>(`/contacts/${id}`, fd);

        return unwrap<Contact>(data);
    }

    async remove(id: number) {
        const response =
            await api.delete<Omit<ApiResponse<Contact>, "data">>(`/contacts/${id}`);

        return response.data;
    }
}
