-- ============================================
-- GAUTENG CITY COLLEGE - SUPABASE SCHEMA
-- ============================================

-- Students table (main auth users)
CREATE TABLE students (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  gender TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student info table (academic details)
CREATE TABLE student_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL REFERENCES students(student_id),
  campus TEXT NOT NULL,
  course TEXT NOT NULL,
  faculty TEXT NOT NULL,
  certificate TEXT NOT NULL,
  year TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedules table (course timetables)
CREATE TABLE schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course TEXT NOT NULL,
  certificate TEXT NOT NULL,
  schedule_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course, certificate)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Students table policies
CREATE POLICY "Users can view own student record"
  ON students FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own student record"
  ON students FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own student record"
  ON students FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Student info policies
CREATE POLICY "Users can view own student info"
  ON student_info FOR SELECT
  USING (
    student_id IN (
      SELECT student_id FROM students WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update own student info"
  ON student_info FOR UPDATE
  USING (
    student_id IN (
      SELECT student_id FROM students WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own student info"
  ON student_info FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT student_id FROM students WHERE id = auth.uid()
    )
  );

-- Schedules policies (all authenticated users can view)
CREATE POLICY "Authenticated users can view schedules"
  ON schedules FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_student_info_student_id ON student_info(student_id);
CREATE INDEX idx_schedules_course_cert ON schedules(course, certificate);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_info_updated_at
  BEFORE UPDATE ON student_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
