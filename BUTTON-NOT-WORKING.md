# 🔧 Login/Signup Buttons Not Working - Troubleshooting

## Quick Diagnosis

### Step 1: Open Browser Console
1. Open your login or signup page
2. Press **F12** (or right-click → Inspect)
3. Click the **Console** tab
4. Look for any red error messages

### Step 2: Check What You See

---

## ❌ If You See: "CORS policy" or "blocked by CORS"

### Problem:
You're opening the HTML file directly (file:// protocol) which blocks ES6 module imports.

### Solution:
You **MUST** run a local web server. Choose one:

#### Option 1: Python (Easiest)
```bash
# If you have Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

#### Option 2: Node.js (http-server)
```bash
# Install globally
npm install -g http-server

# Run in project folder
http-server

# Then open: http://localhost:8080
```

#### Option 3: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

#### Option 4: PHP
```bash
php -S localhost:8000

# Then open: http://localhost:8000
```

---

## ❌ If You See: "Failed to fetch" or "ERR_NAME_NOT_RESOLVED"

### Problem:
Can't load Supabase library from CDN.

### Solution:
Check your internet connection or use the test file:

1. Open `test-supabase.html` in browser (with local server)
2. Click "Test 1: Check if Supabase loads"
3. If it fails, your internet/firewall is blocking the CDN

---

## ❌ If You See: "Cannot find module" or "404 Not Found"

### Problem:
File paths are wrong or files are missing.

### Solution:
Check these files exist:
- `config/supabase.js`
- `lib/supabase-auth.js`
- `lib/validate-form.js`
- `lib/pop-up.js`
- `lib/theme.js`

---

## ❌ If You See: Nothing in Console

### Problem:
Script isn't loading at all.

### Solution:

1. **Check the script tag in HTML:**
   ```html
   <!-- Should have type="module" and defer -->
   <script type="module" src="../js/login-script.js" defer></script>
   ```

2. **Check file paths:**
   - If you're in `pages/login.html`
   - Script should be at `../js/login-script.js`
   - Verify the file exists

3. **Try opening test file:**
   - Open `test-supabase.html` (with local server)
   - If this works, the issue is with your page-specific scripts

---

## ✅ If You See: "Login script loaded" or "Sign-up script loaded"

### Good! Script is loading. Now check:

1. **Click the button and watch console**
   - Should see "Login button clicked" or "Sign-up button clicked"
   - If you don't see this, the button isn't connected

2. **If you see "Form validation failed":**
   - Fill in ALL required fields
   - Check that fields have valid values

3. **If you see "Login function called":**
   - The button works!
   - Check for Supabase errors below that

---

## 🧪 Use the Test File

I created `test-supabase.html` to help diagnose issues:

1. **Start a local server** (see Option 1-4 above)
2. Open `http://localhost:8000/test-supabase.html`
3. Click each test button
4. Check the results

### What Each Test Does:

**Test 1:** Checks if Supabase library loads
- ✓ Pass: Supabase is working
- ✗ Fail: Internet/CDN issue

**Test 2:** Checks database connection
- ✓ Pass: Can connect to your Supabase project
- ✗ Fail: Wrong URL/key or network issue

**Test 3:** Tests actual signup function
- ✓ Pass: Everything works! Issue is elsewhere
- ✗ Fail: Shows specific error message

---

## 🔍 Common Issues & Fixes

### Issue 1: "Script loaded" but button doesn't respond

**Check:**
```javascript
// Open browser console and type:
document.getElementById('login-btn')
```

If it returns `null`, the button ID is wrong or page hasn't loaded.

**Fix:**
Make sure you're waiting for page to load. The scripts use `defer` which should handle this.

---

### Issue 2: Button works but nothing happens

**Check console for:**
- "Form validation failed" → Fill all required fields
- Supabase errors → Check your Supabase URL/key
- Network errors → Check internet connection

---

### Issue 3: "Supabase is not defined"

**Problem:**
The import failed.

**Fix:**
1. Make sure you're using a local server (not file://)
2. Check `config/supabase.js` exists
3. Check internet connection (CDN needs to load)

---

## 📝 Debugging Checklist

Run through this checklist:

- [ ] Using a local web server (not file://)
- [ ] Browser console is open (F12)
- [ ] No red errors in console
- [ ] See "Login script loaded" or "Sign-up script loaded"
- [ ] All form fields are filled in
- [ ] Internet connection is working
- [ ] `config/supabase.js` exists
- [ ] `lib/supabase-auth.js` exists
- [ ] Supabase URL and key are correct

---

## 🆘 Still Not Working?

### Collect This Info:

1. **What do you see in console?**
   - Copy the exact error message
   - Include any red errors

2. **How are you opening the page?**
   - file:// (wrong)
   - http://localhost (correct)

3. **What happens when you click the button?**
   - Nothing
   - Error message
   - Page reloads
   - Something else

4. **Run the test file:**
   - Open `test-supabase.html` with local server
   - Run all 3 tests
   - Share the results

---

## 🚀 Quick Fix Summary

**Most Common Issue: Not using a local server**

```bash
# Run this in your project folder:
python -m http.server 8000

# Then open:
http://localhost:8000/pages/login.html
```

**Second Most Common: Missing files**

Make sure these exist:
- config/supabase.js
- lib/supabase-auth.js
- All other lib/ files

**Third Most Common: Wrong Supabase credentials**

Check `config/supabase.js` has:
- Correct URL: https://qnroaigdrpoceasbqtmh.supabase.co
- Correct anon key (the long JWT token)
