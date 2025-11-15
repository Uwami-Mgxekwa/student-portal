-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('urgent', 'academic', 'financial', 'event', 'general')),
  is_urgent BOOLEAN DEFAULT false,
  target_audience TEXT DEFAULT 'all', -- 'all', 'year-1', 'year-2', 'year-3'
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create announcement_reads table to track which students have read which announcements
CREATE TABLE IF NOT EXISTS announcement_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(announcement_id, student_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_student ON announcement_reads(student_id);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

-- Policies for announcements
CREATE POLICY "Announcements are viewable by everyone" ON announcements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can insert announcements" ON announcements
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update announcements" ON announcements
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete announcements" ON announcements
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for announcement_reads
CREATE POLICY "Users can view their own reads" ON announcement_reads
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reads" ON announcement_reads
  FOR INSERT WITH CHECK (true);

-- Insert sample announcements
INSERT INTO announcements (title, message, type, is_urgent, target_audience) VALUES
('Final Exams Schedule Released', 'The final examination timetable for December 2025 has been published. Please check the Resources section to download your timetable.', 'academic', true, 'all'),
('Payment Deadline Reminder', 'Reminder: Outstanding fees must be paid by November 30, 2025. Visit the Finances page for payment details.', 'financial', false, 'all'),
('Heritage Day Celebration', 'Join us for Heritage Day celebrations on September 24! Traditional food, music, and cultural activities. See Events page for details.', 'event', false, 'all'),
('Library Hours Extended', 'The library will be open until 10 PM during exam period (December 1-12). Make use of the extended study hours!', 'general', false, 'all'),
('Year 2 IT Workshop', 'Special programming workshop for Year 2 IT students on November 20. Register at the IT department office.', 'academic', false, 'year-2');
