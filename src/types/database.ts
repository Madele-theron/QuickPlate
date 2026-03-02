export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    created_at: string
                }
                Insert: {
                    id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    created_at?: string
                }
            }
            preferences: {
                Row: {
                    user_id: string
                    data: Json
                    updated_at: string
                }
                Insert: {
                    user_id: string
                    data?: Json
                    updated_at?: string
                }
                Update: {
                    user_id?: string
                    data?: Json
                    updated_at?: string
                }
            }
            pantry_items: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    normalized_name: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    normalized_name: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    normalized_name?: string
                    created_at?: string
                }
            }
            recipes: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    recipe_json: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    recipe_json: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    recipe_json?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            chat_threads: {
                Row: {
                    id: string
                    user_id: string
                    recipe_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    recipe_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    recipe_id?: string
                    created_at?: string
                }
            }
            chat_messages: {
                Row: {
                    id: string
                    thread_id: string
                    role: 'user' | 'assistant' | 'system'
                    content: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    thread_id: string
                    role: 'user' | 'assistant' | 'system'
                    content: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    thread_id?: string
                    role?: 'user' | 'assistant' | 'system'
                    content?: string
                    created_at?: string
                }
            }
        }
    }
}
