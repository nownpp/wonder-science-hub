-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'announcement', -- announcement, poll, alert
  allow_voting BOOLEAN DEFAULT false,
  target_grade TEXT DEFAULT NULL, -- null means all grades
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Create notification votes table
CREATE TABLE public.notification_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'reject')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(notification_id, user_id)
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_votes ENABLE ROW LEVEL SECURITY;

-- Notification policies
CREATE POLICY "Everyone can view notifications" 
ON public.notifications 
FOR SELECT 
USING (true);

CREATE POLICY "Admins and teachers can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'teacher')
  )
);

CREATE POLICY "Admins and teachers can update notifications" 
ON public.notifications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'teacher')
  )
);

CREATE POLICY "Admins and teachers can delete notifications" 
ON public.notifications 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'teacher')
  )
);

-- Vote policies
CREATE POLICY "Users can view all votes" 
ON public.notification_votes 
FOR SELECT 
USING (true);

CREATE POLICY "Students can vote" 
ON public.notification_votes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their vote" 
ON public.notification_votes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Students can delete their vote" 
ON public.notification_votes 
FOR DELETE 
USING (auth.uid() = user_id);