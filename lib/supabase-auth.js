import { supabase } from "../config/supabase.js";
import { removeLoading, showLoading } from "./loading.js";
import { showAlert } from "./pop-up.js";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const logError = (context, error) => {
  console.group(`❌ ${context}`);
  console.error('Error:', error.message || error);
  if (error.details) console.error('Details:', error.details);
  if (error.hint) console.error('Hint:', error.hint);
  console.groupEnd();
};

const logSuccess = (context, data = null) => {
  console.group(`✅ ${context}`);
  if (data) console.log('Data:', data);
  console.groupEnd();
};

const logInfo = (context, info) => {
  console.log(`ℹ️ ${context}:`, info);
};

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

// Sign up new student
export async function signUpStudent(studentData) {
  showLoading("Signing up...");

  try {
    logInfo('Signup Process Started', `Student ID: ${studentData.studentID}`);

    // Create auth user with their real email
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: studentData.email,
      password: studentData.password,
      options: {
        data: {
          student_id: studentData.studentID,
          first_name: studentData.first_name,
          last_name: studentData.last_name,
        },
        emailRedirectTo: undefined
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Signup failed - no user created");

    logSuccess('Auth User Created', { userId: authData.user.id });

    // Insert student record
    const { error: studentError } = await supabase
      .from('students')
      .insert({
        id: authData.user.id,
        student_id: studentData.studentID,
        first_name: studentData.first_name,
        last_name: studentData.last_name,
        email: studentData.email,
        phone: studentData.phone,
        address: studentData.address,
        gender: studentData.gender,
      });

    if (studentError) throw studentError;

    logSuccess('Signup Complete', `Student ${studentData.studentID} registered`);
    removeLoading();
    showAlert("Success", "Account created successfully!", "success");
    return { success: true };

  } catch (error) {
    logError('Signup Failed', error);
    removeLoading();
    
    // User-friendly error messages
    let errorMessage = error.message;
    if (error.message.includes('already registered')) {
      errorMessage = 'This email is already registered. Please use a different email or try logging in.';
    } else if (error.message.includes('Student ID')) {
      errorMessage = 'This Student ID is already registered.';
    }
    
    showAlert("Sign up error", errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Sign in student
export async function signInStudent(studentID, password) {
  showLoading("Logging in...");

  try {
    logInfo('Login Process Started', `Student ID: ${studentID}`);

    // Look up the email associated with this student ID
    const { data: student, error: lookupError } = await supabase
      .from('students')
      .select('email, first_name')
      .eq('student_id', studentID)
      .maybeSingle();

    if (lookupError) {
      logError('Database Lookup Failed', lookupError);
      throw new Error("Unable to connect to database. Please try again.");
    }

    if (!student) {
      logInfo('Student Not Found', studentID);
      throw new Error("Student ID not found. Please check your Student ID or sign up.");
    }

    logInfo('Student Found', `Attempting login for ${student.first_name}`);

    // Sign in with their email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: student.email,
      password: password,
    });

    if (error) {
      logError('Authentication Failed', error);
      throw new Error("Incorrect password. Please try again.");
    }

    logSuccess('Login Successful', `Welcome ${student.first_name}!`);
    removeLoading();
    return { success: true, user: data.user };

  } catch (error) {
    logError('Login Failed', error);
    removeLoading();
    showAlert("Login error", error.message);
    return { success: false, error: error.message };
  }
}

// Sign out student
export async function signOutStudent() {
  showLoading("Signing out...");

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    logSuccess('Signed Out', 'User logged out successfully');
    removeLoading();
    localStorage.clear();
    location.href = "../index.html";

  } catch (error) {
    logError('Sign Out Failed', error);
    removeLoading();
    showAlert("Sign out error", error.message);
  }
}

// Get current student info
export async function getStudentInfo() {
  showLoading("Loading profile...");

  try {
    logInfo('Profile Load Started', 'Fetching user data');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Get student record
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', user.id)
      .single();

    if (studentError) throw studentError;

    // Try to get student info, but don't fail if table doesn't exist or is empty
    let studentInfo = null;
    try {
      const { data: info, error: infoError } = await supabase
        .from('student_info')
        .select('*')
        .eq('student_id', student.student_id)
        .maybeSingle();

      if (!infoError && info) {
        studentInfo = info;
        logInfo('Student Info Loaded', 'Additional info found');
      } else {
        logInfo('Student Info Empty', 'No additional info available');
      }
    } catch (err) {
      logInfo('Student Info Table Not Found', 'Skipping additional info');
    }

    logSuccess('Profile Loaded', `${student.first_name} ${student.last_name}`);
    removeLoading();
    return {
      success: true,
      student,
      studentInfo: studentInfo
    };

  } catch (error) {
    logError('Profile Load Failed', error);
    removeLoading();
    showAlert("Error loading profile", error.message);
    return { success: false, error: error.message };
  }
}

// Get schedule for student's course
export async function getSchedule(course, certificate) {
  showLoading("Loading schedule...");

  try {
    logInfo('Schedule Load Started', `Course: ${course}, Certificate: ${certificate}`);

    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('course', course)
      .eq('certificate', certificate)
      .single();

    if (error) throw error;

    logSuccess('Schedule Loaded', 'Schedule retrieved');
    removeLoading();
    return { success: true, schedule: data };

  } catch (error) {
    logError('Schedule Load Failed', error);
    removeLoading();
    showAlert("Error loading schedule", error.message);
    return { success: false, error: error.message };
  }
}

// Check if user is logged in
export async function isLoggedIn() {
  const { data: { session } } = await supabase.auth.getSession();
  const loggedIn = !!session;
  logInfo('Session Check', loggedIn ? 'User is logged in' : 'No active session');
  return loggedIn;
}