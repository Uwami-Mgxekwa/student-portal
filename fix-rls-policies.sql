-- ============================================
-- FIX RLS POLICIES FOR SIGNUP
-- ============================================
-- Run this in Supabase SQL Editor to fix the signup issue
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own student record" ON students;
DROP POLICY IF EXISTS "Users can update own student record" ON students;
DROP POLICY IF EXISTS "Users can insert own student record" ON students;

-- Create new policies that work with signup
CREATE POLICY "Users can view own student record"
  ON students FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own student record"
  ON students FOR UPDATE
  USING (auth.uid() = id);

-- This is the key fix: Allow authenticated users to insert their own record
CREATE POLICY "Users can insert own student record"
  ON students FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'students';
