# 📋 Quick Reference Card

## 🔗 Your Supabase Project
**URL:** https://qnroaigdrpoceasbqtmh.supabase.co

## 📝 Setup Order

1. **Run** `supabase-setup.sql` in Supabase SQL Editor
2. **Enable** Email auth in Supabase (turn OFF confirmations)
3. **Run** schedules section from `sample-data.sql`
4. **Sign up** test account through your app
5. **Run** student_info section from `sample-data.sql`
6. **Test** login and navigation

## 🔐 Quick Test Login

```
Student ID: GCC2024001
Password: Test123!
```

## 📁 Files Created

### Keep Forever:
- `config/supabase.js` - Supabase config
- `lib/supabase-auth.js` - Auth functions

### Delete After Testing:
- `lib/auth.js`
- `lib/get-data.js`
- `lib/post-data.js`
- `lib/local-storage.js`
- `lib/check-login.js`
- `config/config.js`
- `assets/backvideo.mp4`
- `assets/bg-video.mp4`

### Delete After Migration:
- `supabase-setup.sql`
- `sample-data.sql`
- `START-HERE.md`
- `MIGRATION-GUIDE.md`
- `TEST-ACCOUNTS.md`
- `FILES-TO-DELETE.md`
- `DELETE-THESE-FILES.txt`
- `SUPABASE-MIGRATION-SUMMARY.md`
- `QUICK-REFERENCE.md`

## 🗄️ Database Tables

### students
- Basic user info (name, email, phone, etc.)
- Linked to Supabase Auth

### student_info
- Academic details (course, faculty, campus, etc.)
- Links to students via student_id

### schedules
- Course timetables
- Stored as JSONB for flexibility

## 🧪 Test Accounts Available

See `TEST-ACCOUNTS.md` for 5 complete test accounts:
- 2 IT students
- 1 Business student
- 1 Engineering student
- 1 Hospitality student

## ⚡ Quick Delete Command

After testing works:
```powershell
Remove-Item lib/auth.js, lib/get-data.js, lib/post-data.js, lib/local-storage.js, lib/check-login.js, config/config.js, assets/backvideo.mp4, assets/bg-video.mp4
```

## 🆘 Common Issues

**"User not found"**
→ Create account through signup form first

**"Not authenticated"**
→ Check Supabase URL/key in config/supabase.js

**Schedule not loading**
→ Run student_info SQL after signup

**Console errors**
→ Check browser console for details

## 📊 What Changed

| Before | After |
|--------|-------|
| Custom backend | Supabase |
| MongoDB | PostgreSQL |
| Manual sessions | Auto sessions |
| $7-34/month | $0/month |
| 11 files | 7 files |

## ✅ Testing Checklist

- [ ] SQL ran successfully
- [ ] Email auth enabled
- [ ] Schedules added
- [ ] Test account created
- [ ] Student info added
- [ ] Can log in
- [ ] Dashboard shows name
- [ ] Profile shows details
- [ ] Schedule loads
- [ ] Sign out works
- [ ] No console errors

## 🎯 Next Steps After Testing

1. Delete old files (see command above)
2. Delete migration docs
3. Deploy to production
4. Update README.md with new setup instructions

---

**Start with `START-HERE.md` for detailed instructions!**
