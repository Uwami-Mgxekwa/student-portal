-- Check which student IDs from the list actually exist in students table
SELECT student_id, first_name, last_name
FROM students
WHERE student_id IN (
  '0310070572089',
  'AB0892087',
  '0307185652087',
  '0307015124083',
  '0710045636085',
  '0706231307085',
  '1407145922087',
  '7399342037381',
  '034',
  '022222',
  '0222',
  '9304046311087',
  '0308125043080',
  '0110225910089',
  '0311290657080',
  '0305051188087',
  '0402205944083',
  '0110260117087'
)
ORDER BY student_id;
