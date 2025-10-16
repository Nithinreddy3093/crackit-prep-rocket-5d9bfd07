export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      career_applications: {
        Row: {
          applicant_email: string
          applicant_name: string
          cover_letter: string | null
          experience_level: string
          id: string
          position: string
          resume_url: string | null
          status: string
          submitted_at: string
        }
        Insert: {
          applicant_email: string
          applicant_name: string
          cover_letter?: string | null
          experience_level: string
          id?: string
          position: string
          resume_url?: string | null
          status?: string
          submitted_at?: string
        }
        Update: {
          applicant_email?: string
          applicant_name?: string
          cover_letter?: string | null
          experience_level?: string
          id?: string
          position?: string
          resume_url?: string | null
          status?: string
          submitted_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          response_notes: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          response_notes?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          response_notes?: string | null
          status?: string
        }
        Relationships: []
      }
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
      questions: {
        Row: {
          correct_answer: string
          created_at: string
          difficulty: string | null
          explanation: string | null
          id: string
          options: Json
          question_text: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          difficulty?: string | null
          explanation?: string | null
          id?: string
          options: Json
          question_text: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          difficulty?: string | null
          explanation?: string | null
          id?: string
          options?: Json
          question_text?: string
          topic_id?: string
          updated_at?: string
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
      quiz_sessions: {
        Row: {
          completed_at: string | null
          correct_answers: number
          created_at: string
          id: string
          question_details: Json | null
          score_percentage: number | null
          started_at: string
          time_spent_ms: number | null
          topic_id: string
          total_questions: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          correct_answers?: number
          created_at?: string
          id?: string
          question_details?: Json | null
          score_percentage?: number | null
          started_at?: string
          time_spent_ms?: number | null
          topic_id: string
          total_questions?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          correct_answers?: number
          created_at?: string
          id?: string
          question_details?: Json | null
          score_percentage?: number | null
          started_at?: string
          time_spent_ms?: number | null
          topic_id?: string
          total_questions?: number
          updated_at?: string
          user_id?: string | null
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
      user_rankings: {
        Row: {
          badges: Json
          id: string
          last_updated: string
          overall_score: number
          percentile: number
          topic_scores: Json
          total_attempts: number
          user_id: string
        }
        Insert: {
          badges?: Json
          id?: string
          last_updated?: string
          overall_score?: number
          percentile?: number
          topic_scores?: Json
          total_attempts?: number
          user_id: string
        }
        Update: {
          badges?: Json
          id?: string
          last_updated?: string
          overall_score?: number
          percentile?: number
          topic_scores?: Json
          total_attempts?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rankings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      get_secure_quiz_questions: {
        Args: { p_limit?: number; p_topic_id: string }
        Returns: {
          difficulty: string
          id: string
          options: Json
          question_text: string
          topic_id: string
        }[]
      }
      update_user_performance: {
        Args: {
          p_completion_time?: number
          p_score: number
          p_topic: string
          p_user_id: string
        }
        Returns: Json
      }
      validate_quiz_answer: {
        Args: { p_question_id: string; p_user_answer: string }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
