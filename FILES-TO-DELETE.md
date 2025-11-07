# Files to Delete After Migration

## ⚠️ DELETE THESE FILES ONLY AFTER TESTING EVERYTHING WORKS

### Old Backend Integration Files (DELETE)
```
lib/auth.js                 ❌ DELETE - Replaced by lib/supabase-auth.js
lib/get-data.js            ❌ DELETE - Replaced by Supabase client
lib/post-data.js           ❌ DELETE - Replaced by Supabase client
lib/local-storage.js       ❌ DELETE - Supabase handles sessions
lib/check-login.js         ❌ DELETE - Replaced by supabase-auth.js
config/config.js           ❌ DELETE - Replaced by config/supabase.js
```

### Keep These Files (KEEP)
```
lib/loading.js             ✅ KEEP - Still used for loading states
lib/pop-up.js              ✅ KEEP - Still used for alerts/modals (updated)
lib/theme.js               ✅ KEEP - Still used for dark/light theme
lib/validate-form.js       ✅ KEEP - Still used for form validation
lib/supabase-auth.js       ✅ KEEP - NEW FILE (all auth logic)
config/supabase.js         ✅ KEEP - NEW FILE (Supabase config)
```

### Check Video Files (OPTIONAL CLEANUP)
You have 3 video files but only use 1:
```
assets/bg-vid-vertical.mp4  ✅ USED in index.html
assets/backvideo.mp4        ❓ CHECK if used anywhere
assets/bg-video.mp4         ❓ CHECK if used anywhere
```

To check if unused videos exist:
1. Search your codebase for "backvideo.mp4"
2. Search your codebase for "bg-video.mp4"
3. If not found, you can delete them to save space

### Migration Files (DELETE AFTER MIGRATION)
```
supabase-setup.sql         ❌ DELETE after running in Supabase
MIGRATION-GUIDE.md         ❌ DELETE after migration complete
FILES-TO-DELETE.md         ❌ DELETE after cleanup (this file)
```

## Deletion Commands

### Windows (PowerShell):
```powershell
# Delete old backend files
Remove-Item lib/auth.js
Remove-Item lib/get-data.js
Remove-Item lib/post-data.js
Remove-Item lib/local-storage.js
Remove-Item lib/check-login.js
Remove-Item config/config.js

# Delete migration files (after migration)
Remove-Item supabase-setup.sql
Remove-Item MIGRATION-GUIDE.md
Remove-Item FILES-TO-DELETE.md
```

### Windows (CMD):
```cmd
del lib\auth.js
del lib\get-data.js
del lib\post-data.js
del lib\local-storage.js
del lib\check-login.js
del config\config.js

del supabase-setup.sql
del MIGRATION-GUIDE.md
del FILES-TO-DELETE.md
```

## Before Deleting - Checklist

- [ ] Ran SQL in Supabase successfully
- [ ] Can sign up new students
- [ ] Can log in with student ID and password
- [ ] Dashboard loads and shows student name
- [ ] Profile page shows all student info
- [ ] Schedule page loads (if you have schedule data)
- [ ] All pages redirect to login when not authenticated
- [ ] Sign out works correctly
- [ ] Theme switching still works
- [ ] No console errors in browser

## After Deletion

Your project structure will be cleaner:
- **Before:** 9 lib files + 2 config files = 11 files
- **After:** 6 lib files + 1 config file = 7 files
- **Reduction:** 36% fewer files to maintain
