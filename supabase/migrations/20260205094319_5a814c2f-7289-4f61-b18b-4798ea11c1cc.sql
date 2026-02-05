-- Create files table for PDF documents
CREATE TABLE public.files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'عام',
  grade TEXT DEFAULT 'الصف الثالث',
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  downloads_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Files are viewable by everyone" 
ON public.files 
FOR SELECT 
USING (true);

-- Create policy for teachers/admins to insert
CREATE POLICY "Teachers can create files" 
ON public.files 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'teacher')
  )
);

-- Create policy for teachers/admins to update
CREATE POLICY "Teachers can update files" 
ON public.files 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'teacher')
  )
);

-- Create policy for teachers/admins to delete
CREATE POLICY "Teachers can delete files" 
ON public.files 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'teacher')
  )
);

-- Create trigger for updating timestamps
CREATE TRIGGER update_files_updated_at
BEFORE UPDATE ON public.files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();