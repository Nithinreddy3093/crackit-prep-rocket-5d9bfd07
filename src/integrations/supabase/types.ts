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
      learning_resources: {
        Row: {
          description: string
          difficulty: string
          id: string
          tags: string[]
          title: string
          topic: string
          type: string
          url: string
        }
        Insert: {
          description: string
          difficulty: string
          id?: string
          tags?: string[]
          title: string
          topic: string
          type: string
          url: string
        }
        Update: {
          description?: string
          difficulty?: string
          id?: string
          tags?: string[]
          title?: string
          topic?: string
          type?: string
          url?: string
        }
        Relationships: []
      }
      performance_history: {
        Row: {
          completion_time: number | null
          date: string
          id: string
          quiz_id: string | null
          score: number
          topic: string
          user_id: string
        }
        Insert: {
          completion_time?: number | null
          date?: string
          id?: string
          quiz_id?: string | null
          score: number
          topic: string
          user_id: string
        }
        Update: {
          completion_time?: number | null
          date?: string
          id?: string
          quiz_id?: string | null
          score?: number
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          completion_time: number | null
          date: string
          id: string
          question_details: Json | null
          score: number
          topic: string
          user_id: string
        }
        Insert: {
          completion_time?: number | null
          date?: string
          id?: string
          question_details?: Json | null
          score: number
          topic: string
          user_id: string
        }
        Update: {
          completion_time?: number | null
          date?: string
          id?: string
          question_details?: Json | null
          score?: number
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
      topic_scores: {
        Row: {
          created_at: string
          id: string
          quizzes_taken: number
          score: number
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          quizzes_taken?: number
          score?: number
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          quizzes_taken?: number
          score?: number
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_description: string
          badge_id: string
          badge_name: string
          earned_date: string
          icon: string
          id: string
          user_id: string
        }
        Insert: {
          badge_description: string
          badge_id: string
          badge_name: string
          earned_date?: string
          icon: string
          id?: string
          user_id: string
        }
        Update: {
          badge_description?: string
          badge_id?: string
          badge_name?: string
          earned_date?: string
          icon?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_performance: {
        Row: {
          created_at: string
          id: string
          last_quiz_date: string | null
          overall_score: number
          quizzes_taken: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_quiz_date?: string | null
          overall_score?: number
          quizzes_taken?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_quiz_date?: string | null
          overall_score?: number
          quizzes_taken?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          achievements: Json
          created_at: string
          email: string
          full_name: string | null
          id: string
          last_login: string
          progress: Json
        }
        Insert: {
          achievements?: Json
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          last_login?: string
          progress?: Json
        }
        Update: {
          achievements?: Json
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          last_login?: string
          progress?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_performance: {
        Args: {
          p_user_id: string
          p_topic: string
          p_score: number
          p_completion_time?: number
        }
        Returns: Json
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
