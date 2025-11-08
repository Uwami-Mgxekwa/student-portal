-- ============================================
-- SUPABASE STORAGE SETUP FOR FILE UPLOADS
-- ============================================
-- This enables cloud-based file storage and management

-- ============================================
-- STEP 1: CREATE STORAGE BUCKET
-- ============================================
-- Run this in Supabase Dashboard > Storage > Create Bucket
-- Bucket name: 'resources'
-- Public: Yes (so students can download)
-- File size limit: 10MB
-- Allowed MIME types: application/pdf

-- Or run this SQL to create the bucket:
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 2: STORAGE POLICIES
-- ============================================

-- Allow authenticated users to read files
CREATE POLICY "Authenticated users can view files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resources');

-- Allow authenticated users to upload files (for admin)
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resources');

-- Allow authenticated users to delete files (for admin)
CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resources');

-- Allow public access to files (for downloads)
CREATE POLICY "Public can view files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resources');

-- ============================================
-- STEP 3: UPDATE RESOURCES TABLE
-- ============================================

-- Drop existing resources table if it exists
DROP TABLE IF EXISTS resources CASCADE;

-- Create new resources table with Supabase Storage integration
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- Path in Supabase Storage
  file_url TEXT NOT NULL, -- Public URL for downloads
  file_size BIGINT, -- File size in bytes
  file_type TEXT DEFAULT 'application/pdf',
  category TEXT NOT NULL, -- 'timetables', 'forms', 'guides', 'policies', 'other'
  course TEXT NOT NULL DEFAULT 'Information Technology',
  year TEXT NOT NULL, -- '1', '2', '3' or 'all'
  certificate TEXT, -- Optional: filter by certificate type
  uploaded_by UUID REFERENCES auth.users(id), -- Track who uploaded
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0, -- Track downloads
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 4: RLS POLICIES FOR RESOURCES TABLE
-- ============================================

-- Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Students can view resources for their year
CREATE POLICY "Students can view resources for their year"
ON resources FOR SELECT
TO authenticated
USING (
  is_active = true AND (
    year = 'all' OR 
    year IN (
      SELECT student_info.year 
      FROM student_info 
      WHERE student_info.student_id IN (
        SELECT student_id FROM students WHERE id = auth.uid()
      )
    )
  )
);

-- Authenticated users can insert resources (admin functionality)
CREATE POLICY "Authenticated users can insert resources"
ON resources FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update resources (admin functionality)
CREATE POLICY "Authenticated users can update resources"
ON resources FOR UPDATE
TO authenticated
USING (true);

-- Authenticated users can delete resources (admin functionality)
CREATE POLICY "Authenticated users can delete resources"
ON resources FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 5: INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_resources_year ON resources(year);
CREATE INDEX idx_resources_course ON resources(course);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_active ON resources(is_active);
CREATE INDEX idx_resources_created_at ON resources(created_at DESC);

-- ============================================
-- STEP 6: TRIGGER FOR UPDATED_AT
-- ============================================

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 7: FUNCTION TO INCREMENT DOWNLOAD COUNT
-- ============================================

CREATE OR REPLACE FUNCTION increment_download_count(resource_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE resources
  SET download_count = download_count + 1
  WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 8: SAMPLE DATA (OPTIONAL)
-- ============================================

-- Note: These are placeholder entries. Actual files will be uploaded via admin panel
INSERT INTO resources (title, description, file_name, storage_path, file_url, category, course, year) VALUES
  ('Welcome Guide', 'Orientation guide for new students', 'welcome-guide.pdf', 'year-1/welcome-guide.pdf', 'https://placeholder.url', 'guides', 'Information Technology', '1'),
  ('Student Handbook', 'General student handbook', 'student-handbook.pdf', 'all-years/student-handbook.pdf', 'https://placeholder.url', 'guides', 'Information Technology', 'all')
ON CONFLICT DO NOTHING;

-- ============================================
-- NOTES
-- ============================================
-- 1. After running this SQL, go to Supabase Dashboard > Storage
-- 2. Verify the 'resources' bucket was created
-- 3. Check that it's set to 'Public'
-- 4. Test uploading a file via the admin panel
-- 5. Files will be organized in folders: year-1/, year-2/, year-3/, all-years/
