-- Add html_code column to simulations table for storing HTML simulation code
ALTER TABLE public.simulations ADD COLUMN html_code TEXT;

-- Add a comment explaining the column purpose
COMMENT ON COLUMN public.simulations.html_code IS 'HTML code for interactive simulations that can be embedded in an iframe';