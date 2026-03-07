import { ResumeData } from "./resume";

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    created_at?: string;
                };
            };
            resumes: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    resume_data: ResumeData;
                    template: string;
                    created_at: string;
                    updated_at: string;
                    is_public: boolean;
                    public_slug: string | null;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    resume_data?: ResumeData;
                    template?: string;
                    created_at?: string;
                    updated_at?: string;
                    is_public?: boolean;
                    public_slug?: string | null;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    resume_data?: ResumeData;
                    template?: string;
                    created_at?: string;
                    updated_at?: string;
                    is_public?: boolean;
                    public_slug?: string | null;
                };
            };
            images: {
                Row: {
                    id: string;
                    user_id: string;
                    image_url: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    image_url: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    image_url?: string;
                    created_at?: string;
                };
            };
        };
    };
}
