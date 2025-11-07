# 🔐 Test Accounts for Login

## How to Set Up Test Accounts

### Step 1: Run Schedule Data
1. Go to Supabase SQL Editor
2. Copy and paste the **schedule data** from `sample-data.sql`
3. Run it (this creates 4 course schedules)

### Step 2: Create Accounts Through Signup Form
You **must** create accounts through your app's signup form (not SQL).

Open your app and sign up with these details:

---

## 👤 Test Account 1 - IT Student

```
Student ID: GCC2024001
First Name: John
Last Name: Doe
Email: john.doe@example.com
Phone: 071 234 5678
Address: 123 Main Street, Johannesburg
Gender: male
Password: Test123!
```

---

## 👤 Test Account 2 - Business Student

```
Student ID: GCC2024002
First Name: Sarah
Last Name: Smith
Email: sarah.smith@example.com
Phone: 082 345 6789
Address: 456 Oak Avenue, Pretoria
Gender: female
Password: Test123!
```

---

## 👤 Test Account 3 - Engineering Student

```
Student ID: GCC2024003
First Name: Michael
Last Name: Johnson
Email: michael.j@example.com
Phone: 083 456 7890
Address: 789 Pine Road, Sandton
Gender: male
Password: Test123!
```

---

## 👤 Test Account 4 - Hospitality Student

```
Student ID: GCC2024004
First Name: Emily
Last Name: Williams
Email: emily.w@example.com
Phone: 084 567 8901
Address: 321 Elm Street, Midrand
Gender: female
Password: Test123!
```

---

## 👤 Test Account 5 - IT Student

```
Student ID: GCC2024005
First Name: David
Last Name: Brown
Email: david.brown@example.com
Phone: 085 678 9012
Address: 654 Maple Drive, Centurion
Gender: male
Password: Test123!
```

---

### Step 3: Add Academic Info
After creating accounts through signup, run the **student_info SQL** from `sample-data.sql` in Supabase SQL Editor.

This will add:
- Campus information
- Course enrollment
- Faculty details
- Certificate type
- Year

---

## 📚 Available Courses & Schedules

After running `sample-data.sql`, these schedules will be available:

1. **Information Technology** - National Certificate
2. **Business Management** - National Diploma
3. **Engineering** - Higher Certificate
4. **Hospitality Management** - National Certificate

---

## 🧪 Testing Scenarios

### Test Login:
- Use Student ID (e.g., `GCC2024001`)
- Use Password: `Test123!`

### Test Different Courses:
- Account 1 & 5: IT students (same schedule)
- Account 2: Business student (different schedule)
- Account 3: Engineering student (different schedule)
- Account 4: Hospitality student (different schedule)

### Test Profile Page:
- Each account has different campus, faculty, course info

---

## ⚡ Quick Setup Commands

### 1. Run in Supabase SQL Editor:
```sql
-- First, run all of supabase-setup.sql
-- Then, run the schedules section from sample-data.sql
```

### 2. Sign up 5 accounts in your app
Use the details above

### 3. Run in Supabase SQL Editor:
```sql
-- Run the student_info section from sample-data.sql
```

### 4. Test login:
```
Student ID: GCC2024001
Password: Test123!
```

---

## 🎯 What Each Account Tests

- **GCC2024001 (John)**: IT course, Main Campus
- **GCC2024002 (Sarah)**: Business course, Main Campus
- **GCC2024003 (Michael)**: Engineering course, North Campus
- **GCC2024004 (Emily)**: Hospitality course, South Campus
- **GCC2024005 (David)**: IT course, Main Campus (duplicate course test)

This covers:
✅ Multiple courses
✅ Multiple campuses
✅ Multiple certificate types
✅ Both genders
✅ Schedule loading for different courses
