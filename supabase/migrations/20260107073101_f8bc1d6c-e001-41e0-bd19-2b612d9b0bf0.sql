-- Create student progress tracking table
CREATE TABLE public.student_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'simulation')),
  content_id UUID NOT NULL,
  completed BOOLEAN DEFAULT false,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent_seconds INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_type, content_id)
);

-- Enable RLS
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Students can view and update their own progress
CREATE POLICY "Students can view their own progress"
ON public.student_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own progress"
ON public.student_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own progress"
ON public.student_progress
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins and teachers can view all progress
CREATE POLICY "Admins can view all progress"
ON public.student_progress
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Teachers can view all progress"
ON public.student_progress
FOR SELECT
USING (has_role(auth.uid(), 'teacher'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_student_progress_updated_at
BEFORE UPDATE ON public.student_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create profiles table for student info
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  grade TEXT DEFAULT 'الصف الثالث',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  
  -- Assign student role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'student');
  
  RETURN new;
END;
$$;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();