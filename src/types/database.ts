export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = 'admin' | 'instructor' | 'student' | 'evaluator';
export type PublishStatus = 'draft' | 'published' | 'archived';
export type SubmissionStatus = 'pending' | 'submitted' | 'grading' | 'graded' | 'late';
export type AssignmentType = 'quiz' | 'file_upload' | 'rich_text' | 'code';
export type QuestionType = 'single' | 'multiple' | 'true_false';
export type CertStatus = 'pending' | 'issued' | 'revoked';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          bio: string | null;
          github_url: string | null;
          linkedin_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          bio?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          bio?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          thumbnail_url: string | null;
          trailer_video_url: string | null;
          instructor_id: string;
          status: PublishStatus;
          difficulty: 'beginner' | 'intermediate' | 'advanced' | null;
          category: string | null;
          tags: string[] | null;
          total_weeks: number;
          passing_score: number;
          best_of_n_total: number | null;
          best_of_n_take: number | null;
          prerequisites_locked: boolean;
          enrollment_open: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['courses']['Row']> & { title: string; slug: string; instructor_id: string; };
        Update: Partial<Database['public']['Tables']['courses']['Row']>;
      };
      modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          position: number;
          week_number: number | null;
          unlock_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['modules']['Row']> & { course_id: string; title: string; position: number; };
        Update: Partial<Database['public']['Tables']['modules']['Row']>;
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          course_id: string;
          title: string;
          type: 'video' | 'article' | 'quiz' | 'assignment';
          position: number;
          content_url: string | null;
          mux_asset_id: string | null;
          mux_playback_id: string | null;
          duration_seconds: number | null;
          transcript_url: string | null;
          is_preview: boolean;
          status: PublishStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['lessons']['Row']> & { module_id: string; course_id: string; title: string; type: string; position: number; };
        Update: Partial<Database['public']['Tables']['lessons']['Row']>;
      };
      enrollments: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          enrolled_at: string;
          completed_at: string | null;
          final_score: number | null;
        };
        Insert: { student_id: string; course_id: string; enrolled_at?: string; };
        Update: { completed_at?: string | null; final_score?: number | null; };
      };
      lesson_progress: {
        Row: {
          id: string;
          student_id: string;
          lesson_id: string;
          course_id: string;
          watched_seconds: number;
          completed: boolean;
          completed_at: string | null;
        };
        Insert: { student_id: string; lesson_id: string; course_id: string; watched_seconds?: number; completed?: boolean; };
        Update: { watched_seconds?: number; completed?: boolean; completed_at?: string | null; };
      };
      assignments: {
        Row: {
          id: string;
          lesson_id: string | null;
          course_id: string;
          module_id: string | null;
          title: string;
          description: string | null;
          type: AssignmentType;
          max_score: number;
          due_at: string;
          late_penalty_pct: number;
          allow_late: boolean;
          week_number: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['assignments']['Row']> & { course_id: string; title: string; type: AssignmentType; due_at: string; };
        Update: Partial<Database['public']['Tables']['assignments']['Row']>;
      };
      submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          grader_id: string | null;
          status: SubmissionStatus;
          file_url: string | null;
          rich_text: string | null;
          code_content: string | null;
          auto_score: number | null;
          manual_score: number | null;
          final_score: number | null;
          feedback: string | null;
          submitted_at: string | null;
          graded_at: string | null;
        };
        Insert: { assignment_id: string; student_id: string; status?: SubmissionStatus; file_url?: string | null; rich_text?: string | null; code_content?: string | null; };
        Update: Partial<Database['public']['Tables']['submissions']['Row']>;
      };
      quizzes: {
        Row: {
          id: string;
          assignment_id: string;
          time_limit_mins: number | null;
          randomize: boolean;
          max_attempts: number;
          created_at: string;
        };
        Insert: { assignment_id: string; time_limit_mins?: number | null; randomize?: boolean; max_attempts?: number; };
        Update: Partial<Database['public']['Tables']['quizzes']['Row']>;
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          question_text: string;
          type: QuestionType;
          options: Json;
          explanation: string | null;
          points: number;
          position: number;
        };
        Insert: { quiz_id: string; question_text: string; type: QuestionType; options: Json; position: number; points?: number; explanation?: string | null; };
        Update: Partial<Database['public']['Tables']['quiz_questions']['Row']>;
      };
      quiz_attempts: {
        Row: {
          id: string;
          quiz_id: string;
          student_id: string;
          submission_id: string | null;
          answers: Json;
          score: number | null;
          max_score: number | null;
          started_at: string;
          submitted_at: string | null;
          time_taken_secs: number | null;
        };
        Insert: { quiz_id: string; student_id: string; answers: Json; submission_id?: string | null; };
        Update: Partial<Database['public']['Tables']['quiz_attempts']['Row']>;
      };
      certificates: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          enrollment_id: string;
          final_score: number | null;
          issued_at: string;
          status: CertStatus;
          pdf_url: string | null;
          verify_token: string;
        };
        Insert: { student_id: string; course_id: string; enrollment_id: string; final_score?: number | null; };
        Update: Partial<Database['public']['Tables']['certificates']['Row']>;
      };
      forum_threads: {
        Row: {
          id: string;
          course_id: string;
          module_id: string | null;
          author_id: string;
          title: string;
          body: string;
          is_pinned: boolean;
          is_answered: boolean;
          upvotes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: { course_id: string; author_id: string; title: string; body: string; module_id?: string | null; };
        Update: Partial<Database['public']['Tables']['forum_threads']['Row']>;
      };
      forum_replies: {
        Row: {
          id: string;
          thread_id: string;
          author_id: string;
          body: string;
          is_instructor: boolean;
          is_accepted: boolean;
          upvotes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: { thread_id: string; author_id: string; body: string; is_instructor?: boolean; };
        Update: Partial<Database['public']['Tables']['forum_replies']['Row']>;
      };
      forum_votes: {
        Row: { id: string; user_id: string; thread_id: string | null; reply_id: string | null; value: 1 | -1; };
        Insert: { user_id: string; value: 1 | -1; thread_id?: string | null; reply_id?: string | null; };
        Update: { value?: 1 | -1; };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          link: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: { user_id: string; type: string; title: string; body?: string | null; link?: string | null; };
        Update: { read?: boolean; };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      user_role: UserRole;
      publish_status: PublishStatus;
      submission_status: SubmissionStatus;
      assignment_type: AssignmentType;
      question_type: QuestionType;
      cert_status: CertStatus;
    };
  };
}

// Convenience row types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Course = Database['public']['Tables']['courses']['Row'];
export type Module = Database['public']['Tables']['modules']['Row'];
export type Lesson = Database['public']['Tables']['lessons']['Row'];
export type Enrollment = Database['public']['Tables']['enrollments']['Row'];
export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];
export type Assignment = Database['public']['Tables']['assignments']['Row'];
export type Submission = Database['public']['Tables']['submissions']['Row'];
export type Quiz = Database['public']['Tables']['quizzes']['Row'];
export type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row'];
export type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row'];
export type Certificate = Database['public']['Tables']['certificates']['Row'];
export type ForumThread = Database['public']['Tables']['forum_threads']['Row'];
export type ForumReply = Database['public']['Tables']['forum_replies']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

export interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface CourseWithInstructor extends Course {
  instructor: Profile;
  enrollment_count?: number;
  lesson_count?: number;
}

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
  instructor: Profile;
}
