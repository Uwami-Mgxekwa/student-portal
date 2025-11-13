-- Add finances for all students (varying amounts and payment statuses)
INSERT INTO student_finances (student_id, total_fees, total_paid, payment_plan, due_date, notes)
VALUES 
  ('0310070572089', 25000.00, 15000.00, 'installments', '2025-12-31', 'Payment plan: R5000 per term'),
  ('AB0892087', 30000.00, 30000.00, 'full', '2025-12-31', 'Paid in full'),
  ('0307015124083', 25000.00, 5000.00, 'installments', '2025-12-31', 'Payment plan: R5000 per term'),
  ('0710045636085', 30000.00, 20000.00, 'installments', '2025-12-31', 'Payment plan: R10000 per term'),
  ('0706231307085', 28000.00, 28000.00, 'full', '2025-12-31', 'Paid in full'),
  ('1407145922087', 25000.00, 0.00, 'installments', '2025-12-31', 'No payments yet'),
  ('7399342037381', 30000.00, 15000.00, 'installments', '2025-12-31', 'Payment plan: R7500 per term'),
  ('034', 28000.00, 14000.00, 'installments', '2025-12-31', 'Payment plan: R7000 per term'),
  ('022222', 25000.00, 25000.00, 'full', '2025-12-31', 'Paid in full'),
  ('0222', 30000.00, 10000.00, 'installments', '2025-12-31', 'Payment plan: R10000 per term'),
  ('9304046311087', 28000.00, 8000.00, 'installments', '2025-12-31', 'Payment plan: R7000 per term'),
  ('0308125043080', 25000.00, 12500.00, 'installments', '2025-12-31', 'Payment plan: R6250 per term'),
  ('0110225910089', 30000.00, 0.00, 'installments', '2025-12-31', 'No payments yet'),
  ('0311290657080', 28000.00, 28000.00, 'full', '2025-12-31', 'Paid in full'),
  ('0305051188087', 25000.00, 5000.00, 'installments', '2025-12-31', 'Payment plan: R5000 per term'),
  ('0402205944083', 30000.00, 15000.00, 'installments', '2025-12-31', 'Payment plan: R7500 per term'),
  ('0110260117087', 28000.00, 14000.00, 'installments', '2025-12-31', 'Payment plan: R7000 per term')
ON CONFLICT (student_id) DO NOTHING;

-- Add fee breakdown for all students (same structure for all)
INSERT INTO fee_breakdown (student_id, fee_type, amount, description, academic_year)
VALUES 
  -- Student 1: 0310070572089
  ('0310070572089', 'Tuition', 20000.00, 'Annual tuition fees', '2025'),
  ('0310070572089', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('0310070572089', 'Materials', 2000.00, 'Course materials', '2025'),
  ('0310070572089', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 2: AB0892087
  ('AB0892087', 'Tuition', 25000.00, 'Annual tuition fees', '2025'),
  ('AB0892087', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('AB0892087', 'Materials', 2000.00, 'Course materials', '2025'),
  ('AB0892087', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 3: 0307015124083
  ('0307015124083', 'Tuition', 20000.00, 'Annual tuition fees', '2025'),
  ('0307015124083', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('0307015124083', 'Materials', 2000.00, 'Course materials', '2025'),
  ('0307015124083', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 5: 0710045636085
  ('0710045636085', 'Tuition', 25000.00, 'Annual tuition fees', '2025'),
  ('0710045636085', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('0710045636085', 'Materials', 2000.00, 'Course materials', '2025'),
  ('0710045636085', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 6: 0706231307085
  ('0706231307085', 'Tuition', 23000.00, 'Annual tuition fees', '2025'),
  ('0706231307085', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('0706231307085', 'Materials', 2000.00, 'Course materials', '2025'),
  ('0706231307085', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 7: 1407145922087
  ('1407145922087', 'Tuition', 20000.00, 'Annual tuition fees', '2025'),
  ('1407145922087', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('1407145922087', 'Materials', 2000.00, 'Course materials', '2025'),
  ('1407145922087', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 8: 7399342037381
  ('7399342037381', 'Tuition', 25000.00, 'Annual tuition fees', '2025'),
  ('7399342037381', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('7399342037381', 'Materials', 2000.00, 'Course materials', '2025'),
  ('7399342037381', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 9: 034
  ('034', 'Tuition', 23000.00, 'Annual tuition fees', '2025'),
  ('034', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('034', 'Materials', 2000.00, 'Course materials', '2025'),
  ('034', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 10: 022222
  ('022222', 'Tuition', 20000.00, 'Annual tuition fees', '2025'),
  ('022222', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('022222', 'Materials', 2000.00, 'Course materials', '2025'),
  ('022222', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 11: 0222
  ('0222', 'Tuition', 25000.00, 'Annual tuition fees', '2025'),
  ('0222', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('0222', 'Materials', 2000.00, 'Course materials', '2025'),
  ('0222', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 12: 9304046311087
  ('9304046311087', 'Tuition', 23000.00, 'Annual tuition fees', '2025'),
  ('9304046311087', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('9304046311087', 'Materials', 2000.00, 'Course materials', '2025'),
  ('9304046311087', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 13: 0308125043080
  ('0308125043080', 'Tuition', 20000.00, 'Annual tuition fees', '2025'),
  ('0308125043080', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('0308125043080', 'Materials', 2000.00, 'Course materials', '2025'),
  ('0308125043080', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 14: 0110225910089
  ('0110225910089', 'Tuition', 25000.00, 'Annual tuition fees', '2025'),
  ('0110225910089', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('0110225910089', 'Materials', 2000.00, 'Course materials', '2025'),
  ('0110225910089', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 15: 0311290657080
  ('0311290657080', 'Tuition', 23000.00, 'Annual tuition fees', '2025'),
  ('0311290657080', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('0311290657080', 'Materials', 2000.00, 'Course materials', '2025'),
  ('0311290657080', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 16: 0305051188087
  ('0305051188087', 'Tuition', 20000.00, 'Annual tuition fees', '2025'),
  ('0305051188087', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('0305051188087', 'Materials', 2000.00, 'Course materials', '2025'),
  ('0305051188087', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 17: 0402205944083
  ('0402205944083', 'Tuition', 25000.00, 'Annual tuition fees', '2025'),
  ('0402205944083', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('0402205944083', 'Materials', 2000.00, 'Course materials', '2025'),
  ('0402205944083', 'Lab', 1000.00, 'Lab fees', '2025'),
  
  -- Student 18: 0110260117087
  ('0110260117087', 'Tuition', 23000.00, 'Annual tuition fees', '2025'),
  ('0110260117087', 'Registration', 2000.00, 'Registration fee', '2025'),
  ('0110260117087', 'Materials', 2000.00, 'Course materials', '2025'),
  ('0110260117087', 'Lab', 1000.00, 'Lab fees', '2025')
ON CONFLICT DO NOTHING;

-- Add sample payment history for students who have made payments
INSERT INTO payment_history (student_id, payment_date, amount, payment_method, reference_number, description, added_by)
VALUES 
  -- Student 1: 0310070572089 (R15,000 paid)
  ('0310070572089', '2025-02-01', 5000.00, 'Bank Transfer', 'REF001', 'First term payment', 'Admin'),
  ('0310070572089', '2025-05-01', 5000.00, 'Bank Transfer', 'REF002', 'Second term payment', 'Admin'),
  ('0310070572089', '2025-08-01', 5000.00, 'Cash', 'CASH001', 'Third term payment', 'Admin'),
  
  -- Student 2: AB0892087 (R30,000 paid - FULL)
  ('AB0892087', '2025-01-15', 30000.00, 'Bank Transfer', 'REF003', 'Full payment for 2025', 'Admin'),
  
  -- Student 3: 0307015124083 (R5,000 paid)
  ('0307015124083', '2025-02-15', 5000.00, 'Cash', 'CASH002', 'First term payment', 'Admin'),
  
  -- Student 5: 0710045636085 (R20,000 paid)
  ('0710045636085', '2025-01-20', 10000.00, 'Bank Transfer', 'REF005', 'First payment', 'Admin'),
  ('0710045636085', '2025-05-15', 10000.00, 'Bank Transfer', 'REF006', 'Second payment', 'Admin'),
  
  -- Student 6: 0706231307085 (R28,000 paid - FULL)
  ('0706231307085', '2025-01-10', 28000.00, 'Bank Transfer', 'REF007', 'Full payment for 2025', 'Admin'),
  
  -- Student 8: 7399342037381 (R15,000 paid)
  ('7399342037381', '2025-02-05', 7500.00, 'EFT', 'REF008', 'First term payment', 'Admin'),
  ('7399342037381', '2025-05-10', 7500.00, 'Bank Transfer', 'REF009', 'Second term payment', 'Admin'),
  
  -- Student 9: 034 (R14,000 paid)
  ('034', '2025-02-20', 7000.00, 'Cash', 'CASH003', 'First term payment', 'Admin'),
  ('034', '2025-05-20', 7000.00, 'Bank Transfer', 'REF010', 'Second term payment', 'Admin'),
  
  -- Student 10: 022222 (R25,000 paid - FULL)
  ('022222', '2025-01-25', 25000.00, 'Bank Transfer', 'REF011', 'Full payment for 2025', 'Admin'),
  
  -- Student 11: 0222 (R10,000 paid)
  ('0222', '2025-02-12', 10000.00, 'EFT', 'REF012', 'Initial payment', 'Admin'),
  
  -- Student 12: 9304046311087 (R8,000 paid)
  ('9304046311087', '2025-02-18', 8000.00, 'Cash', 'CASH004', 'First payment', 'Admin'),
  
  -- Student 13: 0308125043080 (R12,500 paid)
  ('0308125043080', '2025-02-08', 6250.00, 'Bank Transfer', 'REF013', 'First term payment', 'Admin'),
  ('0308125043080', '2025-05-08', 6250.00, 'Bank Transfer', 'REF014', 'Second term payment', 'Admin'),
  
  -- Student 15: 0311290657080 (R28,000 paid - FULL)
  ('0311290657080', '2025-01-12', 28000.00, 'Bank Transfer', 'REF015', 'Full payment for 2025', 'Admin'),
  
  -- Student 16: 0305051188087 (R5,000 paid)
  ('0305051188087', '2025-02-22', 5000.00, 'Cash', 'CASH005', 'First term payment', 'Admin'),
  
  -- Student 17: 0402205944083 (R15,000 paid)
  ('0402205944083', '2025-02-14', 7500.00, 'EFT', 'REF016', 'First term payment', 'Admin'),
  ('0402205944083', '2025-05-14', 7500.00, 'Bank Transfer', 'REF017', 'Second term payment', 'Admin'),
  
  -- Student 18: 0110260117087 (R14,000 paid)
  ('0110260117087', '2025-02-16', 7000.00, 'Bank Transfer', 'REF018', 'First term payment', 'Admin'),
  ('0110260117087', '2025-05-16', 7000.00, 'Cash', 'CASH006', 'Second term payment', 'Admin')
ON CONFLICT DO NOTHING;

-- Verify the data
SELECT 
  sf.student_id,
  sf.total_fees,
  sf.total_paid,
  sf.outstanding_balance,
  COUNT(DISTINCT ph.id) as payments_made,
  COUNT(DISTINCT fb.id) as fee_items
FROM student_finances sf
LEFT JOIN payment_history ph ON sf.student_id = ph.student_id
LEFT JOIN fee_breakdown fb ON sf.student_id = fb.student_id
GROUP BY sf.student_id, sf.total_fees, sf.total_paid, sf.outstanding_balance
ORDER BY sf.outstanding_balance DESC;