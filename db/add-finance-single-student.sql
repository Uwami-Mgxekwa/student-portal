-- ============================================
-- ADD FINANCE DATA FOR ONE STUDENT
-- ============================================
-- Replace 'YOUR_STUDENT_ID' with an actual student ID from your database

-- Add finances
INSERT INTO student_finances (student_id, total_fees, total_paid, payment_plan, due_date, notes)
VALUES 
  ('0310070572089', 25000.00, 15000.00, 'installments', '2025-12-31', 'Payment plan: R5000 per term')
ON CONFLICT (student_id) DO NOTHING;

-- Add payment history
INSERT INTO payment_history (student_id, payment_date, amount, payment_method, reference_number, description, added_by)
VALUES 
  ('0310070572089', '2025-02-01', 5000.00, 'Bank Transfer', 'REF001234', 'First term payment', 'Admin'),
  ('0310070572089', '2025-05-01', 5000.00, 'Bank Transfer', 'REF001567', 'Second term payment', 'Admin'),
  ('0310070572089', '2025-08-01', 5000.00, 'Cash', 'CASH001', 'Third term payment', 'Admin');

-- Add fee breakdown
INSERT INTO fee_breakdown (student_id, fee_type, amount, description, academic_year)
VALUES 
  ('0310070572089', 'Tuition', 20000.00, 'Annual tuition fees', '2025'),
  ('0310070572089', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('0310070572089', 'Materials', 2000.00, 'Course materials and textbooks', '2025'),
  ('0310070572089', 'Lab', 1000.00, 'Lab and practical fees', '2025');

-- Verify
SELECT * FROM student_finances WHERE student_id = '0310070572089';
SELECT * FROM payment_history WHERE student_id = '0310070572089';
SELECT * FROM fee_breakdown WHERE student_id = '0310070572089';
