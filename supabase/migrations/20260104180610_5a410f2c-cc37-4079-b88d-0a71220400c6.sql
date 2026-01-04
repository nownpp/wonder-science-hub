
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');

-- Create user_roles table for authorization
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create videos table
CREATE TABLE public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT NOT NULL DEFAULT 'عام',
    grade TEXT DEFAULT 'الصف الثالث',
    duration TEXT,
    views_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on videos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create simulations table
CREATE TABLE public.simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    simulation_url TEXT,
    thumbnail_url TEXT,
    category TEXT NOT NULL DEFAULT 'عام',
    grade TEXT DEFAULT 'الصف الثالث',
    difficulty TEXT DEFAULT 'سهل',
    plays_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on simulations
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for videos (public read, admin/teacher write)
CREATE POLICY "Anyone can view videos"
ON public.videos
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage videos"
ON public.videos
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can manage videos"
ON public.videos
FOR ALL
USING (public.has_role(auth.uid(), 'teacher'));

-- RLS Policies for simulations (public read, admin/teacher write)
CREATE POLICY "Anyone can view simulations"
ON public.simulations
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage simulations"
ON public.simulations
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can manage simulations"
ON public.simulations
FOR ALL
USING (public.has_role(auth.uid(), 'teacher'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_simulations_updated_at
BEFORE UPDATE ON public.simulations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
