-- Create storage bucket for thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true);

-- Allow authenticated users to upload thumbnails
CREATE POLICY "Authenticated users can upload thumbnails"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'thumbnails');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update thumbnails"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'thumbnails');

-- Allow authenticated users to delete thumbnails
CREATE POLICY "Authenticated users can delete thumbnails"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'thumbnails');

-- Allow public read access to thumbnails
CREATE POLICY "Public read access for thumbnails"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'thumbnails');