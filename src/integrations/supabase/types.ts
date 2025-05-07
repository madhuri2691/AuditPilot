export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_checklists: {
        Row: {
          assessment_year: string | null
          created_at: string
          financial_year: string | null
          id: string
          start_date: string | null
          task_id: string
          type: string
          updated_at: string
        }
        Insert: {
          assessment_year?: string | null
          created_at?: string
          financial_year?: string | null
          id?: string
          start_date?: string | null
          task_id: string
          type: string
          updated_at?: string
        }
        Update: {
          assessment_year?: string | null
          created_at?: string
          financial_year?: string | null
          id?: string
          start_date?: string | null
          task_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_checklists_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          description: string | null
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string
          last_reminder_date: string | null
          reminder_sent: boolean | null
          status: string
          task_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          invoice_date: string
          invoice_number: string
          last_reminder_date?: string | null
          reminder_sent?: boolean | null
          status: string
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          last_reminder_date?: string | null
          reminder_sent?: boolean | null
          status?: string
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          area: string
          checklist_id: string
          created_at: string
          id: string
          is_done: boolean | null
          procedure: string
          remarks: string | null
          responsibility: string | null
          timeline: string | null
          updated_at: string
        }
        Insert: {
          area: string
          checklist_id: string
          created_at?: string
          id?: string
          is_done?: boolean | null
          procedure: string
          remarks?: string | null
          responsibility?: string | null
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          area?: string
          checklist_id?: string
          created_at?: string
          id?: string
          is_done?: boolean | null
          procedure?: string
          remarks?: string | null
          responsibility?: string | null
          timeline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "audit_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      client_team_members: {
        Row: {
          client_id: string
          created_at: string
          id: string
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_team_members_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          assignment_staff: string | null
          audit_completion_date: string | null
          audit_fee: string | null
          audit_partner: string | null
          audit_start_date: string | null
          constitution: string | null
          contact_person: string | null
          contact_role: string | null
          created_at: string
          email: string | null
          engagement_type: string | null
          entity_type: string | null
          fiscal_year_end: string | null
          id: string
          industry: string | null
          name: string
          phone: string | null
          priority: string | null
          risk_level: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          assignment_staff?: string | null
          audit_completion_date?: string | null
          audit_fee?: string | null
          audit_partner?: string | null
          audit_start_date?: string | null
          constitution?: string | null
          contact_person?: string | null
          contact_role?: string | null
          created_at?: string
          email?: string | null
          engagement_type?: string | null
          entity_type?: string | null
          fiscal_year_end?: string | null
          id?: string
          industry?: string | null
          name: string
          phone?: string | null
          priority?: string | null
          risk_level?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          assignment_staff?: string | null
          audit_completion_date?: string | null
          audit_fee?: string | null
          audit_partner?: string | null
          audit_start_date?: string | null
          constitution?: string | null
          contact_person?: string | null
          contact_role?: string | null
          created_at?: string
          email?: string | null
          engagement_type?: string | null
          entity_type?: string | null
          fiscal_year_end?: string | null
          id?: string
          industry?: string | null
          name?: string
          phone?: string | null
          priority?: string | null
          risk_level?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          client_id: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          storage_path: string | null
          task_id: string | null
          type: string
          updated_at: string
          version: number | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          storage_path?: string | null
          task_id?: string | null
          type: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          storage_path?: string | null
          task_id?: string | null
          type?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_analysis: {
        Row: {
          client_id: string
          created_at: string
          data: Json | null
          id: string
          task_id: string | null
          updated_at: string
          variances: Json | null
          year: string
        }
        Insert: {
          client_id: string
          created_at?: string
          data?: Json | null
          id?: string
          task_id?: string | null
          updated_at?: string
          variances?: Json | null
          year: string
        }
        Update: {
          client_id?: string
          created_at?: string
          data?: Json | null
          id?: string
          task_id?: string | null
          updated_at?: string
          variances?: Json | null
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_analysis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_analysis_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_settings: {
        Row: {
          address: string | null
          created_at: string
          firm_name: string
          gstin: string | null
          id: string
          is_igst: boolean | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          firm_name: string
          gstin?: string | null
          id?: string
          is_igst?: boolean | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          firm_name?: string
          gstin?: string | null
          id?: string
          is_igst?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      sampling_records: {
        Row: {
          created_at: string
          id: string
          module_type: string
          sample_parameters: Json | null
          sample_results: Json | null
          task_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          module_type: string
          sample_parameters?: Json | null
          sample_results?: Json | null
          task_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          module_type?: string
          sample_parameters?: Json | null
          sample_results?: Json | null
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sampling_records_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_id: string | null
          client_id: string | null
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          name: string
          progress: number | null
          sac_code: string | null
          status: string
          type_of_service: string | null
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          client_id?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          name: string
          progress?: number | null
          sac_code?: string | null
          status: string
          type_of_service?: string | null
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          client_id?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          name?: string
          progress?: number | null
          sac_code?: string | null
          status?: string
          type_of_service?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          updated_at: string
          user_id: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
