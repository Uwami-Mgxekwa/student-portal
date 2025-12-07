-- ============================================
-- FIX RLS POLICIES - REMOVE CONFLICTS
-- ============================================
-- This fixes the "59 issues" by properly configuring RLS policies

-- ============================================
-- 1. DROP CONFLICTING POLICIES
-- ============================================

-- Drop conflicting finance policies
DROP POLICY IF EXISTS "Authenticated users can manage finances" ON student_finances;
DROP POLICY IF EXISTS "Authenticated users can manage payments" ON payment_history;
DROP POLICY IF EXISTS "Authenticated users can manage fees" ON fee_breakdown;

-- Drop conflicting resource policies
DROP POLICY IF EXISTS "Authenticated users can insert resources" ON resources;
DROP POLICY IF EXISTS "Authenticated users can update resources" ON resources;
DROP POLICY IF EXISTS "Authenticated users can delete resources" ON resources;

-- ============================================
-- 2. CREATE PROPER POLICIES
-- ============================================

-- STUDENT_FINANCES: Students read-only, admins full access
CREATE POLICY "Students view own finances, admins view all"
ON student_finances FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT student_id FROM students WHERE id = auth.uid()
  )
);

CREATE POLICY "Service role can manage finances"
ON student_finances FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- PAYMENT_HISTORY: Students read-only, admins full access
CREATE POLICY "Students view own payments, admins view all"
ON payment_history FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT student_id FROM students WHERE id = auth.uid()
  )
);

CREATE POLICY "Service role can manage payments"
ON payment_history FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- FEE_BREAKDOWN: Students read-only, admins full access
CREATE POLICY "Students view own fees, admins view all"
ON fee_breakdown FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT student_id FROM students WHERE id = auth.uid()
  )
);

CREATE POLICY "Service role can manage fees"
ON fee_breakdown FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- RESOURCES: Students read based on year, admins full access
CREATE POLICY "Service role can manage resources"
ON resources FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- SUPPORT_TICKETS: If this table exists, add policies
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'support_tickets') THEN
    EXECUTE 'ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY';
    
    EXECUTE 'CREATE POLICY "Users view own tickets" ON support_tickets FOR SELECT TO authenticated USING (
      student_id IN (SELECT student_id FROM students WHERE id = auth.uid())
    )';
    
    EXECUTE 'CREATE POLICY "Users create own tickets" ON support_tickets FOR INSERT TO authenticated WITH CHECK (
      student_id IN (SELECT student_id FROM students WHERE id = auth.uid())
    )';
    
    EXECUTE 'CREATE POLICY "Service role manages tickets" ON support_tickets FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- ============================================
-- 3. VERIFY RLS IS ENABLED
-- ============================================

-- Ensure RLS is enabled on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_breakdown ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. VERIFICATION QUERY
-- ============================================

SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'students', 'student_info', 'schedules', 
    'student_finances', 'payment_history', 'fee_breakdown',
    'resources', 'events', 'announcements', 'support_tickets'
  )
ORDER BY tablename;
