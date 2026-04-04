CREATE POLICY "Public can verify students by student_id"
ON students FOR SELECT
TO anon
USING (true);

CREATE POLICY "Public can verify student info by student_id"
ON student_info FOR SELECT
TO anon
USING (true);
