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
          role_id: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          role_id?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          role_id?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      standards: {
        Row: {
          id: string
          name: string
          slug: string
          display_order: number | null
          is_active: boolean | null
          seo_title: string | null
          seo_description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: any
        Update: any
      }
      subjects: { Row: { id: string, name: string, slug: string }, Insert: any, Update: any }
      mediums: { Row: { id: string, name: string, slug: string }, Insert: any, Update: any }
      resource_types: { Row: { id: string, name: string, slug: string }, Insert: any, Update: any }
      resources: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          standard_id: string
          subject_id: string
          medium_id: string | null
          resource_type_id: string | null
          year: number | null
          file_url: string | null
          file_size: string | null
          author_id: string | null
          status: string | null
          published_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: any
        Update: any
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
