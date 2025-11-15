-- Resources table (year-specific PDFs and materials)
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf',
  category TEXT NOT NULL, -- 'timetables', 'forms', 'guides', 'policies', 'other'
  course TEXT NOT NULL DEFAULT 'Information Technology',
  year TEXT NOT NULL, -- '1', '2', '3' or 'all'
  certificate TEXT, -- Optional: filter by certificate type
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update schedules table to include year
ALTER TABLE schedules ADD COLUMN IF NOT EXISTS year TEXT DEFAULT 'all';

-- Drop old unique constraint and add new one with year
ALTER TABLE schedules DROP CONSTRAINT IF EXISTS schedules_course_certificate_key;
ALTER TABLE schedules ADD CONSTRAINT schedules_course_cert_year_unique 
  UNIQUE(course, certificate, year);

-- Enable RLS on resources
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Resources policies (students can view resources for their year)
CREATE POLICY "Students can view resources for their year"
  ON resources FOR SELECT
  TO authenticated
  USING (
    year = 'all' OR 
    year IN (
      SELECT student_info.year 
      FROM student_info 
      WHERE student_info.student_id IN (
        SELECT student_id FROM students WHERE id = auth.uid()
      )
    )
  );

-- Admin policy (for future admin role)
CREATE POLICY "Admins can manage all resources"
  ON resources FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resources_year ON resources(year);
CREATE INDEX IF NOT EXISTS idx_resources_course ON resources(course);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_schedules_year ON schedules(year);

-- Trigger for updated_at
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- Insert sample resources for different years
INSERT INTO resources (title, description, file_name, file_path, category, course, year) VALUES
  ('Year 1 Orientation Guide', 'Welcome guide for first year IT students', 'Year-1-Orientation.pdf', 'resources/Year-1-Orientation.pdf', 'guides', 'Information Technology', '1'),
  ('Year 2 Course Outline', 'Course outline for second year IT students', 'Year-2-Course-Outline.pdf', 'resources/Year-2-Course-Outline.pdf', 'guides', 'Information Technology', '2'),
  ('Year 3 Project Guidelines', 'Final year project guidelines', 'Year-3-Project-Guidelines.pdf', 'resources/Year-3-Project-Guidelines.pdf', 'guides', 'Information Technology', '3'),
  ('Exam Timetable 2025', 'Examination timetable for all years', 'Exam-Timetable-2025.pdf', 'resources/Exam-Timetable-2025.pdf', 'timetables', 'Information Technology', 'all'),
  ('Application Form', 'General application form', 'Application-Form.pdf', 'resources/Application-Form.pdf', 'forms', 'Information Technology', 'all'),
  ('Student Handbook', 'Student handbook for all years', 'Student-Handbook.pdf', 'resources/Student-Handbook.pdf', 'guides', 'Information Technology', 'all')
ON CONFLICT DO NOTHING;
