-- ============================================
-- ADD FINANCE DATA FOR STUDENT 010101
-- ============================================

-- Add finances
INSERT INTO student_finances (student_id, total_fees, total_paid, payment_plan, due_date, notes)
VALUES 
  ('010101', 25000.00, 2300.00, 'installments', '2025-12-31', 'Payment plan: R5000 per term')
ON CONFLICT (student_id) DO NOTHING;

-- Add fee breakdown
INSERT INTO fee_breakdown (student_id, fee_type, amount, description, academic_year)
VALUES 
  ('010101', 'Tuition', 20000.00, 'Annual tuition fees', '2025'),
  ('010101', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('010101', 'Materials', 2000.00, 'Course materials and textbooks', '2025'),
  ('010101', 'Lab', 1000.00, 'Lab and practical fees', '2025')
ON CONFLICT DO NOTHING;

-- Add payment history
INSERT INTO payment_history (student_id, payment_date, amount, payment_method, reference_number, description, added_by)
VALUES 
  ('010101', '2025-02-15', 2300.00, 'Bank Transfer', 'REF019', 'Initial payment', 'Admin')
ON CONFLICT DO NOTHING;

-- Verify
SELECT 
  sf.student_id,
  sf.total_fees,
  sf.total_paid,
  sf.outstanding_balance,
  sf.payment_plan,
  sf.due_date
FROM student_finances sf
WHERE sf.student_id = '010101';

SELECT * FROM fee_breakdown WHERE student_id = '010101';
