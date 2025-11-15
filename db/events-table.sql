-- Create events table for admin to manage campus events
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('academic', 'social', 'workshop')),
  attendees INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (students can view events)
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

-- Policy: Allow authenticated users to insert (admin only in practice)
CREATE POLICY "Authenticated users can insert events" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update (admin only in practice)
CREATE POLICY "Authenticated users can update events" ON events
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete (admin only in practice)
CREATE POLICY "Authenticated users can delete events" ON events
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample events
INSERT INTO events (title, event_date, time, location, description, event_type, attendees) VALUES
('Freshers', '2025-02-10', '9:00 AM - 5:00 PM', 'Main Campus', 'Welcome event for new students to meet peers, explore campus, and learn about college life.', 'social', 250),
('MR and MRS GCC', '2025-03-15', '6:00 PM - 10:00 PM', 'College Auditorium', 'Annual pageant competition celebrating talent, personality, and school spirit.', 'social', 180),
('Sports Day', '2025-04-22', '8:00 AM - 4:00 PM', 'Sports Complex', 'Inter-campus sports competition featuring various athletic events and team games.', 'social', 320),
('Exam Workshops', '2025-05-05', '10:00 AM - 3:00 PM', 'Lecture Hall A', 'Comprehensive exam preparation workshops covering study techniques and time management.', 'academic', 150),
('Student Exam Workshops', '2025-05-12', '2:00 PM - 5:00 PM', 'Computer Lab 2', 'Student-led peer tutoring sessions and exam revision workshops.', 'workshop', 85),
('Heritage Day', '2025-09-24', '10:00 AM - 6:00 PM', 'Campus Grounds', 'Celebrate South African culture with traditional food, music, dance, and cultural exhibitions.', 'social', 400),
('GBV Awareness Day', '2025-11-25', '9:00 AM - 2:00 PM', 'Conference Hall', 'Educational event raising awareness about gender-based violence with guest speakers and support resources.', 'academic', 200);
