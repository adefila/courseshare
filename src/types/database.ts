export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          created_by: string | null;
          course_name: string;
          course_code: string;
          university: string;
          semester: string;
          year: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          created_by?: string | null;
          course_name: string;
          course_code: string;
          university: string;
          semester: string;
          year: number;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          created_by?: string | null;
          course_name?: string;
          course_code?: string;
          university?: string;
          semester?: string;
          year?: number;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      resources: {
        Row: {
          id: string;
          course_id: string;
          uploaded_by: string | null;
          title: string;
          description: string | null;
          file_path: string;
          file_size_bytes: number | null;
          file_type: string | null;
          is_removed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          uploaded_by?: string | null;
          title: string;
          description?: string | null;
          file_path: string;
          file_size_bytes?: number | null;
          file_type?: string | null;
          is_removed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          uploaded_by?: string | null;
          title?: string;
          description?: string | null;
          file_path?: string;
          file_size_bytes?: number | null;
          file_type?: string | null;
          is_removed?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          resource_id: string | null;
          reported_by: string | null;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          resource_id?: string | null;
          reported_by?: string | null;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          resource_id?: string | null;
          reported_by?: string | null;
          reason?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type Resource = Database["public"]["Tables"]["resources"]["Row"];
export type Report = Database["public"]["Tables"]["reports"]["Row"];
