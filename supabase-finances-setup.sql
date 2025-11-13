-- ============================================
-- STUDENT FINANCES SYSTEM
-- ============================================
-- Read-only for students, admin manages all payments

-- ============================================
-- STUDENT FINANCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS student_finances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL REFERENCES students(student_id),
  total_fees DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_paid DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  outstanding_balance DECIMAL(10,2) GENERATED ALWAYS AS (total_fees - total_paid) STORED,
  payment_plan TEXT, -- 'full', 'installments', 'bursary'
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PAYMENT HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(student_id),
  payment_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL, -- 'Bank Transfer', 'Cash', 'Card', 'EFT'
  reference_number TEXT NOT NULL,
  description TEXT,
  added_by TEXT, -- Admin who recorded the payment
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FEE BREAKDOWN TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS fee_breakdown (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(student_id),
  fee_type TEXT NOT NULL, -- 'Tuition', 'Registration', 'Materials', 'Lab', 'Exam', 'Other'
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  academic_year TEXT NOT NULL, -- '2025', '2026'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE RLS
-- ============================================
ALTER TABLE student_finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_breakdown ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - STUDENTS (READ ONLY)
-- ============================================

-- Students can only view their own finances
CREATE POLICY "Students can view own finances"
ON student_finances FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT student_id FROM students WHERE id = auth.uid()
  )
);

-- Students can only view their own payment history
CREATE POLICY "Students can view own payment history"
ON payment_history FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT student_id FROM students WHERE id = auth.uid()
  )
);

-- Students can only view their own fee breakdown
CREATE POLICY "Students can view own fee breakdown"
ON fee_breakdown FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT student_id FROM students WHERE id = auth.uid()
  )
);

-- ============================================
-- RLS POLICIES - ADMIN (FULL ACCESS)
-- ============================================

-- Admin can insert/update/delete finances
CREATE POLICY "Authenticated users can manage finances"
ON student_finances FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage payments"
ON payment_history FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage fees"
ON fee_breakdown FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_student_finances_student_id ON student_finances(student_id);
CREATE INDEX idx_payment_history_student_id ON payment_history(student_id);
CREATE INDEX idx_payment_history_date ON payment_history(payment_date DESC);
CREATE INDEX idx_fee_breakdown_student_id ON fee_breakdown(student_id);

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================
CREATE TRIGGER update_student_finances_updated_at
  BEFORE UPDATE ON student_finances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (FOR TESTING)
-- ============================================

-- Note: Replace 'STUDENT_ID' with actual student IDs from your database

-- Example: Add finances for a student
INSERT INTO student_finances (student_id, total_fees, total_paid, payment_plan, due_date, notes)
VALUES 
  ('STUDENT_ID_1', 25000.00, 15000.00, 'installments', '2025-12-31', 'Payment plan: R5000 per term'),
  ('STUDENT_ID_2', 30000.00, 30000.00, 'full', '2025-12-31', 'Paid in full')
ON CONFLICT (student_id) DO NOTHING;

-- Example: Add payment history
INSERT INTO payment_history (student_id, payment_date, amount, payment_method, reference_number, description, added_by)
VALUES 
  ('STUDENT_ID_1', '2025-02-01', 5000.00, 'Bank Transfer', 'REF001234', 'First term payment', 'Admin'),
  ('STUDENT_ID_1', '2025-05-01', 5000.00, 'Bank Transfer', 'REF001567', 'Second term payment', 'Admin'),
  ('STUDENT_ID_1', '2025-08-01', 5000.00, 'Cash', 'CASH001', 'Third term payment', 'Admin')
ON CONFLICT DO NOTHING;

-- Example: Add fee breakdown
INSERT INTO fee_breakdown (student_id, fee_type, amount, description, academic_year)
VALUES 
  ('STUDENT_ID_1', 'Tuition', 20000.00, 'Annual tuition fees', '2025'),
  ('STUDENT_ID_1', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('STUDENT_ID_1', 'Materials', 2000.00, 'Course materials and textbooks', '2025'),
  ('STUDENT_ID_1', 'Lab', 1000.00, 'Lab and practical fees', '2025')
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY SETUP
-- ============================================
SELECT 'student_finances' as table_name, COUNT(*) as row_count FROM student_finances
UNION ALL
SELECT 'payment_history', COUNT(*) FROM payment_history
UNION ALL
SELECT 'fee_breakdown', COUNT(*) FROM fee_breakdown;
