import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl =
  (import.meta as any).env.VITE_SUPABASE_URL ||
  "https://kwyyorcrrtipwtrqcumw.supabase.co";
const supabaseAnonKey =
  (import.meta as any).env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eWlvcmNycnRpcHd0cnFjdW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTUxNjAsImV4cCI6MjA4MTg5MTE2MH0.KSBQ7jEi8n8YL_pW-uU6oqqCGmKgjE2VPniWK57gmo4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: "admin" | "editor" | "viewer";
          status: "active" | "inactive";
          avatar: string;
          created_at: string;
          created_by: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string;
          role: "admin" | "editor" | "viewer";
          status?: "active" | "inactive";
          avatar?: string;
          created_at?: string;
          created_by?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: "admin" | "editor" | "viewer";
          status?: "active" | "inactive";
          avatar?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          email?: string;
          phone?: string;
          status: "Active" | "Inactive" | "Pending";
          activity: string;
          monthly_projects: number;
          this_month_projects: any[];
          total_projects: number;
          client_since: string;
          priority: "High" | "Medium" | "Low";
          budget: "Premium" | "Standard" | "Basic";
          image?: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string;
          phone?: string;
          status?: "Active" | "Inactive" | "Pending";
          activity?: string;
          monthly_projects?: number;
          this_month_projects?: any[];
          total_projects?: number;
          client_since?: string;
          priority?: "High" | "Medium" | "Low";
          budget?: "Premium" | "Standard" | "Basic";
          image?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          status?: "Active" | "Inactive" | "Pending";
          activity?: string;
          monthly_projects?: number;
          this_month_projects?: any[];
          total_projects?: number;
          client_since?: string;
          priority?: "High" | "Medium" | "Low";
          budget?: "Premium" | "Standard" | "Basic";
          image?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          client: string;
          status: "planning" | "in-progress" | "review" | "completed";
          priority: "high" | "medium" | "low";
          deadline: string;
          description: string;
          progress: number;
          team: any[];
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          client: string;
          status?: "planning" | "in-progress" | "review" | "completed";
          priority?: "high" | "medium" | "low";
          deadline?: string;
          description?: string;
          progress?: number;
          team?: any[];
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          client?: string;
          status?: "planning" | "in-progress" | "review" | "completed";
          priority?: "high" | "medium" | "low";
          deadline?: string;
          description?: string;
          progress?: number;
          team?: any[];
          updated_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          action: string;
          target: string;
          target_type: "client" | "project" | "user";
          target_id: string;
          details?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_name: string;
          action: string;
          target: string;
          target_type: "client" | "project" | "user";
          target_id: string;
          details?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_name?: string;
          action?: string;
          target?: string;
          target_type?: "client" | "project" | "user";
          target_id?: string;
          details?: string;
        };
      };
    };
  };
}
