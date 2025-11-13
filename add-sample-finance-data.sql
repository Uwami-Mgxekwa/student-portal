-- ============================================
-- ADD SAMPLE FINANCE DATA FOR TESTING
-- ============================================
-- Replace these student IDs with actual ones from your database

-- Add finances for 2 students
INSERT INTO student_finances (student_id, total_fees, total_paid, payment_plan, due_date, notes)
VALUES 
  ('0310070572089', 25000.00, 15000.00, 'installments', '2025-12-31', 'Payment plan: R5000 per term'),
  ('0222', 28000.00, 10000.00, 'installments', '2025-12-31', 'Payment plan: R7000 per term')
ON CONFLICT (student_id) DO NOTHING;

-- Add payment history for student 1 (0310070572089)
INSERT INTO payment_history (student_id, payment_date, amount, payment_method, reference_number, description, added_by)
VALUES 
  ('0310070572089', '2025-02-01', 5000.00, 'Bank Transfer', 'REF001234', 'First term payment', 'Admin'),
  ('0310070572089', '2025-05-01', 5000.00, 'Bank Transfer', 'REF001567', 'Second term payment', 'Admin'),
  ('0310070572089', '2025-08-01', 5000.00, 'Cash', 'CASH001', 'Third term payment', 'Admin')
ON CONFLICT DO NOTHING;

-- Add payment history for student 3 (0222)
INSERT INTO payment_history (student_id, payment_date, amount, payment_method, reference_number, description, added_by)
VALUES 
  ('0222', '2025-02-10', 10000.00, 'EFT', 'REF003456', 'Initial payment', 'Admin')
ON CONFLICT DO NOTHING;

-- Add fee breakdown for student 1 (0310070572089)
INSERT INTO fee_breakdown (student_id, fee_type, amount, description, academic_year)
VALUES 
  ('0310070572089', 'Tuition', 20000.00, 'Annual tuition fees', '2025'),
  ('0310070572089', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('0310070572089', 'Materials', 2000.00, 'Course materials and textbooks', '2025'),
  ('0310070572089', 'Lab', 1000.00, 'Lab and practical fees', '2025')
ON CONFLICT DO NOTHING;

-- Add fee breakdown for student 3 (0222)
INSERT INTO fee_breakdown (student_id, fee_type, amount, description, academic_year)
VALUES 
  ('0222', 'Tuition', 23000.00, 'Annual tuition fees', '2025'),
  ('0222', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('0222', 'Materials', 2000.00, 'Course materials and textbooks', '2025'),
  ('0222', 'Exam', 1000.00, 'Examination fees', '2025')
ON CONFLICT DO NOTHING;

-- Verify data was added
SELECT 
  sf.student_id,
  sf.total_fees,
  sf.total_paid,
  sf.outstanding_balance,
  COUNT(ph.id) as payment_count,
  COUNT(fb.id) as fee_items
FROM student_finances sf
LEFT JOIN payment_history ph ON sf.student_id = ph.student_id
LEFT JOIN fee_breakdown fb ON sf.student_id = fb.student_id
GROUP BY sf.student_id, sf.total_fees, sf.total_paid, sf.outstanding_balance
ORDER BY sf.student_id;
