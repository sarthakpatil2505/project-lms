-- ============================================================================
-- Enterprise LMS: Master Database Schema & Row-Level Security (RLS)
-- Combines Coursera video/module experience with NPTEL weekly rigor & certification
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUMS
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'instructor', 'evaluator', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE course_status AS ENUM ('draft', 'review', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lesson_type AS ENUM ('video', 'article', 'quiz', 'assignment', 'interactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE assignment_type AS ENUM ('code', 'file_upload', 'rich_text', 'quiz');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM ('submitted', 'graded', 'late', 'under_review');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quiz_question_type AS ENUM ('single_choice', 'multiple_choice', 'true_false', 'short_answer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE certificate_status AS ENUM ('issued', 'revoked', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. CORE TABLES
-- ============================================================================

-- Profiles Table (Synced with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'student'::user_role NOT NULL,
    institution TEXT,
    bio TEXT,
    headline TEXT,
    website TEXT,
    github_handle TEXT,
    linkedin_handle TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    headline TEXT,
    description TEXT,
    thumbnail_url TEXT,
    trailer_video_url TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'all_levels')) DEFAULT 'all_levels',
    estimated_hours INTEGER DEFAULT 40,
    passing_grade_percent NUMERIC(5, 2) DEFAULT 75.00 NOT NULL,
    best_of_n_count INTEGER DEFAULT 8,
    total_assignment_weeks INTEGER DEFAULT 12,
    status course_status DEFAULT 'draft'::course_status NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_free BOOLEAN DEFAULT true,
    price_cents INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Modules / Weeks Table
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    week_number INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    unlock_at TIMESTAMPTZ,
    is_prerequisite_locked BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(course_id, week_number)
);

-- Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    type lesson_type DEFAULT 'video'::lesson_type NOT NULL,
    order_index INTEGER NOT NULL,
    duration_seconds INTEGER DEFAULT 0,
    mux_playback_id TEXT,
    mux_asset_id TEXT,
    video_url TEXT,
    transcript TEXT,
    content_markdown TEXT,
    is_preview BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(module_id, order_index)
);

-- Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    status enrollment_status DEFAULT 'active'::enrollment_status NOT NULL,
    current_lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    progress_percentage NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    final_calculated_score NUMERIC(5, 2) DEFAULT 0.00,
    completed_at TIMESTAMPTZ,
    enrolled_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(user_id, course_id)
);

-- Lesson Progress Table (Coursera-style resume position & completion)
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    last_position_seconds INTEGER DEFAULT 0 NOT NULL,
    highest_position_seconds INTEGER DEFAULT 0 NOT NULL,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(enrollment_id, lesson_id)
);

-- Weekly Assignments Table (NPTEL style with rigid deadlines)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type assignment_type DEFAULT 'file_upload'::assignment_type NOT NULL,
    week_number INTEGER NOT NULL,
    weight_percentage NUMERIC(5, 2) DEFAULT 10.00 NOT NULL,
    max_score NUMERIC(5, 2) DEFAULT 100.00 NOT NULL,
    deadline_at TIMESTAMPTZ NOT NULL,
    hard_cutoff_at TIMESTAMPTZ,
    allowed_file_types TEXT[] DEFAULT ARRAY['pdf', 'zip']::TEXT[],
    max_file_size_mb INTEGER DEFAULT 25,
    rubric_json JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Assignment Submissions Table
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    file_url TEXT,
    rich_text_content TEXT,
    code_content TEXT,
    status submission_status DEFAULT 'submitted'::submission_status NOT NULL,
    score NUMERIC(5, 2),
    feedback TEXT,
    evaluator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    submitted_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    graded_at TIMESTAMPTZ,
    UNIQUE(assignment_id, user_id)
);

-- Quizzes Table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    instructions TEXT,
    time_limit_minutes INTEGER DEFAULT 30,
    passing_score_percent NUMERIC(5, 2) DEFAULT 70.00 NOT NULL,
    max_attempts INTEGER DEFAULT 3,
    shuffle_questions BOOLEAN DEFAULT true,
    show_instant_feedback BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Quiz Questions Table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    order_index INTEGER NOT NULL,
    prompt TEXT NOT NULL,
    type quiz_question_type DEFAULT 'single_choice'::quiz_question_type NOT NULL,
    options JSONB NOT NULL, -- Array of { id: string, text: string }
    correct_options JSONB NOT NULL, -- Array of ids or values
    explanation TEXT,
    points NUMERIC(5, 2) DEFAULT 1.00 NOT NULL
);

-- Quiz Attempts Table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    attempt_number INTEGER NOT NULL,
    answers JSONB DEFAULT '{}'::JSONB NOT NULL,
    score NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    total_points NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    percentage NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    is_passed BOOLEAN DEFAULT false NOT NULL,
    started_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    completed_at TIMESTAMPTZ
);

-- Certificates Table (Coursera / NPTEL accredited style)
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE RESTRICT NOT NULL,
    status certificate_status DEFAULT 'issued'::certificate_status NOT NULL,
    final_score NUMERIC(5, 2) NOT NULL,
    pdf_url TEXT,
    qr_code_data TEXT NOT NULL,
    security_hash TEXT NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    UNIQUE(user_id, course_id)
);

-- Proctored Exam Schedules (NPTEL Hall Ticket & Exam booking style)
CREATE TABLE IF NOT EXISTS public.proctored_exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    exam_date TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 180,
    hall_ticket_deadline TIMESTAMPTZ NOT NULL,
    center_location TEXT DEFAULT 'Online Proctored',
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Proctored Exam Registrations Table
CREATE TABLE IF NOT EXISTS public.exam_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.proctored_exams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    hall_ticket_number TEXT UNIQUE NOT NULL,
    slot_time TIMESTAMPTZ NOT NULL,
    score NUMERIC(5, 2),
    attendance_status TEXT DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'present', 'absent')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(exam_id, user_id)
);

-- Discussion Forum Threads (Threaded Q&A per Module/Week)
CREATE TABLE IF NOT EXISTS public.forum_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false NOT NULL,
    is_instructor_answered BOOLEAN DEFAULT false NOT NULL,
    upvotes_count INTEGER DEFAULT 0 NOT NULL,
    replies_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Forum Replies Table
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    parent_reply_id UUID REFERENCES public.forum_replies(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_endorsed_by_instructor BOOLEAN DEFAULT false NOT NULL,
    upvotes_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false NOT NULL,
    type TEXT DEFAULT 'system' CHECK (type IN ('system', 'assignment', 'grade', 'forum', 'certificate')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 3. AUTOMATIC TRIGGERS & FUNCTIONS
-- ============================================================================

-- Automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Profile creation on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'::user_role)
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for course updated_at
DROP TRIGGER IF EXISTS trigger_courses_updated_at ON public.courses;
CREATE TRIGGER trigger_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for modules updated_at
DROP TRIGGER IF EXISTS trigger_modules_updated_at ON public.modules;
CREATE TRIGGER trigger_modules_updated_at
    BEFORE UPDATE ON public.modules
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for lessons updated_at
DROP TRIGGER IF EXISTS trigger_lessons_updated_at ON public.lessons;
CREATE TRIGGER trigger_lessons_updated_at
    BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Best of N score computation function (NPTEL calculation)
CREATE OR REPLACE FUNCTION public.calculate_best_of_n_score(p_enrollment_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    v_user_id UUID;
    v_course_id UUID;
    v_best_n INTEGER;
    v_calculated_score NUMERIC(5, 2);
BEGIN
    SELECT user_id, course_id INTO v_user_id, v_course_id
    FROM public.enrollments
    WHERE id = p_enrollment_id;

    SELECT COALESCE(best_of_n_count, 8) INTO v_best_n
    FROM public.courses
    WHERE id = v_course_id;

    WITH top_scores AS (
        SELECT COALESCE(s.score, 0) as score
        FROM public.assignments a
        LEFT JOIN public.assignment_submissions s 
            ON s.assignment_id = a.id AND s.user_id = v_user_id AND s.status = 'graded'
        WHERE a.course_id = v_course_id
        ORDER BY score DESC
        LIMIT v_best_n
    )
    SELECT COALESCE(AVG(score), 0.00) INTO v_calculated_score
    FROM top_scores;

    UPDATE public.enrollments
    SET final_calculated_score = v_calculated_score
    WHERE id = p_enrollment_id;

    RETURN v_calculated_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 4. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proctored_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper role check functions for RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_instructor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_evaluator()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('evaluator', 'instructor', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Courses Policies
CREATE POLICY "Published courses are viewable by all" 
    ON public.courses FOR SELECT 
    USING (status = 'published' OR instructor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Instructors can create courses" 
    ON public.courses FOR INSERT 
    WITH CHECK (auth.uid() = instructor_id AND public.is_instructor());

CREATE POLICY "Instructors can update their own courses" 
    ON public.courses FOR UPDATE 
    USING (instructor_id = auth.uid() OR public.is_admin());

-- Modules Policies
CREATE POLICY "Modules viewable if course is accessible" 
    ON public.modules FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = modules.course_id 
              AND (c.status = 'published' OR c.instructor_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Instructors can manage modules" 
    ON public.modules FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = modules.course_id 
              AND (c.instructor_id = auth.uid() OR public.is_admin())
        )
    );

-- Lessons Policies
CREATE POLICY "Lessons viewable by enrolled users or previews" 
    ON public.lessons FOR SELECT 
    USING (
        is_preview = true 
        OR EXISTS (
            SELECT 1 FROM public.courses c
            JOIN public.modules m ON m.course_id = c.id
            WHERE m.id = lessons.module_id 
              AND (c.instructor_id = auth.uid() OR public.is_admin())
        )
        OR EXISTS (
            SELECT 1 FROM public.enrollments e
            JOIN public.modules m ON m.course_id = e.course_id
            WHERE m.id = lessons.module_id AND e.user_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can manage lessons" 
    ON public.lessons FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.modules m
            JOIN public.courses c ON c.id = m.course_id
            WHERE m.id = lessons.module_id 
              AND (c.instructor_id = auth.uid() OR public.is_admin())
        )
    );

-- Enrollments Policies
CREATE POLICY "Users can view their own enrollments" 
    ON public.enrollments FOR SELECT 
    USING (user_id = auth.uid() OR public.is_admin() OR EXISTS (
        SELECT 1 FROM public.courses c WHERE c.id = enrollments.course_id AND c.instructor_id = auth.uid()
    ));

CREATE POLICY "Users can enroll themselves" 
    ON public.enrollments FOR INSERT 
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own enrollment state" 
    ON public.enrollments FOR UPDATE 
    USING (user_id = auth.uid() OR public.is_admin());

-- Lesson Progress Policies
CREATE POLICY "Users manage their own progress" 
    ON public.lesson_progress FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.enrollments e 
            WHERE e.id = lesson_progress.enrollment_id AND e.user_id = auth.uid()
        )
    );

-- Assignments Policies
CREATE POLICY "Assignments viewable by enrolled students & instructors" 
    ON public.assignments FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.enrollments e 
            WHERE e.course_id = assignments.course_id AND e.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.courses c 
            WHERE c.id = assignments.course_id AND (c.instructor_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Instructors manage assignments" 
    ON public.assignments FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.courses c 
            WHERE c.id = assignments.course_id AND (c.instructor_id = auth.uid() OR public.is_admin())
        )
    );

-- Assignment Submissions Policies
CREATE POLICY "Students can view own submissions; instructors can view course submissions" 
    ON public.assignment_submissions FOR SELECT 
    USING (
        user_id = auth.uid() 
        OR public.is_evaluator()
    );

CREATE POLICY "Students can create submissions before cutoff" 
    ON public.assignment_submissions FOR INSERT 
    WITH CHECK (
        user_id = auth.uid() 
        AND EXISTS (
            SELECT 1 FROM public.assignments a 
            WHERE a.id = assignment_submissions.assignment_id 
              AND NOW() <= COALESCE(a.hard_cutoff_at, a.deadline_at)
        )
    );

CREATE POLICY "Evaluators can grade submissions" 
    ON public.assignment_submissions FOR UPDATE 
    USING (public.is_evaluator());

-- Quizzes & Quiz Questions Policies
CREATE POLICY "Quizzes viewable by enrolled students & instructors" 
    ON public.quizzes FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.enrollments e 
            WHERE e.course_id = quizzes.course_id AND e.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.courses c 
            WHERE c.id = quizzes.course_id AND (c.instructor_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Quiz questions viewable by enrolled students & instructors" 
    ON public.quiz_questions FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.enrollments e ON e.course_id = q.course_id
            WHERE q.id = quiz_questions.quiz_id AND e.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.courses c ON c.id = q.course_id
            WHERE q.id = quiz_questions.quiz_id AND (c.instructor_id = auth.uid() OR public.is_admin())
        )
    );

-- Quiz Attempts Policies
CREATE POLICY "Students manage own quiz attempts" 
    ON public.quiz_attempts FOR ALL 
    USING (user_id = auth.uid() OR public.is_evaluator());

-- Certificates Policies (Public verification)
CREATE POLICY "Certificates are publicly viewable for verification" 
    ON public.certificates FOR SELECT USING (true);

CREATE POLICY "System / Admins can issue certificates" 
    ON public.certificates FOR INSERT 
    WITH CHECK (public.is_admin() OR public.is_instructor());

-- Forum Policies
CREATE POLICY "Forum threads are viewable by enrolled users" 
    ON public.forum_threads FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = forum_threads.course_id 
              AND (c.status = 'published' OR c.instructor_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Users can create forum threads" 
    ON public.forum_threads FOR INSERT 
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors and instructors can update forum threads" 
    ON public.forum_threads FOR UPDATE 
    USING (author_id = auth.uid() OR public.is_instructor());

CREATE POLICY "Forum replies viewable by enrolled users" 
    ON public.forum_replies FOR SELECT USING (true);

CREATE POLICY "Users can reply to threads" 
    ON public.forum_replies FOR INSERT 
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Notifications viewable and manageable by recipient" 
    ON public.notifications FOR ALL 
    USING (user_id = auth.uid());
