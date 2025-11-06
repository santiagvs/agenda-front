export interface Contact {
    id: string;
    name: string;
    phone: string;
    email?: string;
    photo?: string | File;
    photo_url?: string;
    created_at?: Date;
    updated_at?: Date;
}