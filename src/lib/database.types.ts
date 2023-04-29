export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      figures: {
        Row: {
          created_at: string | null
          figure: boolean[]
          id: string
          width: number
        }
        Insert: {
          created_at?: string | null
          figure: boolean[]
          id?: string
          width?: number
        }
        Update: {
          created_at?: string | null
          figure?: boolean[]
          id?: string
          width?: number
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
      }
      rooms: {
        Row: {
          created_at: string
          creator: string
          current: boolean[]
          figure: string
          id: string
          players: string[] | null
          solved: boolean
        }
        Insert: {
          created_at?: string
          creator: string
          current: boolean[]
          figure: string
          id?: string
          players?: string[] | null
          solved?: boolean
        }
        Update: {
          created_at?: string
          creator?: string
          current?: boolean[]
          figure?: string
          id?: string
          players?: string[] | null
          solved?: boolean
        }
      }
    }
    Views: {
      random_figure: {
        Row: {
          created_at: string | null
          figure: boolean[] | null
          id: string | null
          width: number | null
        }
        Insert: {
          created_at?: string | null
          figure?: boolean[] | null
          id?: string | null
          width?: number | null
        }
        Update: {
          created_at?: string | null
          figure?: boolean[] | null
          id?: string | null
          width?: number | null
        }
      }
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
