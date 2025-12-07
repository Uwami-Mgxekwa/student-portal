-- ============================================
-- SIMPLE RLS FIX - ALLOW AUTHENTICATED USERS
-- ============================================
-- This gives all logged-in users full access (good for development)

-- ============================================
-- DROP ALL EXISTING POLICIES
-- ============================================

-- Students table
DROP POLICY IF EXISTS "Users can view own student record" ON students;
DROP POLICY IF EXISTS "Users can update own student record" ON students;
DROP POLICY IF EXISTS "Users can insert own student record" ON students;
DROP POLICY IF EXISTS "Students view own finances, admins view all" ON student_finances;
DROP POLICY IF EXISTS "Service role can manage finances" ON student_finances;

-- Student info
DROP POLICY IF EXISTS "Users can view own student info" ON student_info;
DROP POLICY IF EXISTS "Users can update own student info" ON student_info;
DROP POLICY IF EXISTS "Users can insert own student info" ON student_info;

-- Finances
DROP POLICY IF EXISTS "Students can view own finances" ON student_finances;
DROP POLICY IF EXISTS "Students view own payments, admins view all" ON payment_history;
DROP POLICY IF EXISTS "Service role can manage payments" ON payment_history;
DROP POLICY IF EXISTS "Students view own fees, admins view all" ON fee_breakdown;
DROP POLICY IF EXISTS "Service role can manage fees" ON fee_breakdown;

-- Payment history
DROP POLICY IF EXISTS "Students can view own payment history" ON payment_history;

-- Fee breakdown
DROP POLICY IF EXISTS "Students can view own fee breakdown" ON fee_breakdown;

-- Resources
DROP POLICY IF EXISTS "Students can view resources for their year" ON resources;
DROP POLICY IF EXISTS "Service role can manage resources" ON resources;

-- Support tickets (if exists)
DROP POLICY IF EXISTS "Users view own tickets" ON support_tickets;
DROP POLICY IF EXISTS "Users create own tickets" ON support_tickets;
DROP POLICY IF EXISTS "Service role manages tickets" ON support_tickets;

-- ============================================
-- CREATE SIMPLE POLICIES - FULL ACCESS FOR AUTHENTICATED
-- ============================================

-- STUDENTS: Full access for authenticated users
CREATE POLICY "Authenticated users full access to students"
ON students FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- STUDENT_INFO: Full access for authenticated users
CREATE POLICY "Authenticated users full access to student_info"
ON student_info FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- SCHEDULES: Already has good policy, keep it
-- (Authenticated users can view schedules)

-- STUDENT_FINANCES: Full access for authenticated users
CREATE POLICY "Authenticated users full access to finances"
ON student_finances FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- PAYMENT_HISTORY: Full access for authenticated users
CREATE POLICY "Authenticated users full access to payments"
ON payment_history FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- FEE_BREAKDOWN: Full access for authenticated users
CREATE POLICY "Authenticated users full access to fees"
ON fee_breakdown FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- RESOURCES: Full access for authenticated users
CREATE POLICY "Authenticated users full access to resources"
ON resources FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- EVENTS: Already has good policies, keep them

-- ANNOUNCEMENTS: Already has good policies, keep them

-- ANNOUNCEMENT_READS: Already has good policies, keep them

-- SUPPORT_TICKETS: If exists, add full access
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'support_tickets') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users view own tickets" ON support_tickets';
    EXECUTE 'DROP POLICY IF EXISTS "Users create own tickets" ON support_tickets';
    EXECUTE 'CREATE POLICY "Authenticated users full access to tickets" ON support_tickets FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
  tablename,
  policyname,
  cmd as "Operation",
  qual as "USING clause",
  with_check as "WITH CHECK clause"
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN (
    'students', 'student_info', 'schedules', 
    'student_finances', 'payment_history', 'fee_breakdown',
    'resources', 'events', 'announcements'
  )
ORDER BY tablename, policyname;
