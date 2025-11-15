-- ============================================
-- ADD YEAR COLUMN TO SCHEDULES TABLE
-- ============================================
-- This allows different schedules for different years

-- Step 1: Add year column
ALTER TABLE schedules 
ADD COLUMN IF NOT EXISTS year TEXT DEFAULT 'all';

-- Step 2: Drop old unique constraint
ALTER TABLE schedules 
DROP CONSTRAINT IF EXISTS schedules_course_certificate_key;

-- Step 3: Add new unique constraint with year
ALTER TABLE schedules 
ADD CONSTRAINT schedules_course_cert_year_unique 
UNIQUE(course, certificate, year);

-- Step 4: Update existing schedules to have year = 'all' (if any exist)
UPDATE schedules 
SET year = 'all' 
WHERE year IS NULL;

-- Verify the changes
SELECT course, certificate, year, created_at 
FROM schedules 
ORDER BY course, certificate, year;
