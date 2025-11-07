import { supabase } from "../config/supabase.js";
import { removeLoading, showLoading } from "./loading.js";
import { showAlert } from "./pop-up.js";

// Sign up new student
export async function signUpStudent(studentData) {
  showLoading("Signing up...");

  try {
    console.log("Starting signup process...");
    console.log("Student ID:", studentData.studentID);

    // Generate a dummy email from student ID (bypasses email validation)
    const dummyEmail = `${studentData.studentID.toLowerCase()}@student.gcc.local`;
    console.log("Generated internal email:", dummyEmail);

    // Create auth user with dummy email
    console.log("Creating auth user...");
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: dummyEmail,
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

    console.log("Auth signup result:", authData, authError);

    if (authError) {
      console.error("Auth error:", authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Signup failed - no user created");
    }

    console.log("Auth user created, ID:", authData.user.id);

    // Insert student record
    console.log("Creating student record...");
    const { error: studentError } = await supabase
      .from('students')
      .insert({
        id: authData.user.id,
        student_id: studentData.studentID,
        first_name: studentData.first_name,
        last_name: studentData.last_name,
        email: studentData.email || dummyEmail, // Store real email if provided, otherwise dummy
        phone: studentData.phone,
        address: studentData.address,
        gender: studentData.gender,
      });

    console.log("Student record result:", studentError);

    if (studentError) {
      console.error("Student insert error:", studentError);
      throw studentError;
    }

    console.log("Signup successful!");
    removeLoading();
    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    removeLoading();
    showAlert("Sign up error", error.message);
    return { success: false, error: error.message };
  }
}

// Sign in student
export async function signInStudent(studentID, password) {
  showLoading("Logging in...");

  try {
    console.log("Looking up student ID:", studentID);

    // Generate the same dummy email format used during signup
    const dummyEmail = `${studentID.toLowerCase()}@student.gcc.local`;
    console.log("Using internal email:", dummyEmail);

    // Sign in with dummy email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dummyEmail,
      password: password,
    });

    console.log("Login attempt result:", data, error);

    if (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid Student ID or password. Please check your credentials.");
    }

    removeLoading();
    return { success: true, user: data.user };
  } catch (error) {
    console.error("Login error:", error);
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

    removeLoading();
    localStorage.clear();
    location.href = "../index.html";
  } catch (error) {
    removeLoading();
    showAlert("Sign out error", error.message);
  }
}

// Get current student info
export async function getStudentInfo() {
  showLoading("Loading profile...");

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Get student record
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', user.id)
      .single();

    if (studentError) throw studentError;

    // Get student info
    const { data: studentInfo, error: infoError } = await supabase
      .from('student_info')
      .select('*')
      .eq('student_id', student.student_id)
      .single();

    if (infoError && infoError.code !== 'PGRST116') throw infoError;

    removeLoading();
    return {
      success: true,
      student,
      studentInfo: studentInfo || null
    };
  } catch (error) {
    removeLoading();
    showAlert("Error loading profile", error.message);
    return { success: false, error: error.message };
  }
}

// Get schedule for student's course
export async function getSchedule(course, certificate) {
  showLoading("Loading schedule...");

  try {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('course', course)
      .eq('certificate', certificate)
      .single();

    if (error) throw error;

    removeLoading();
    return { success: true, schedule: data };
  } catch (error) {
    removeLoading();
    showAlert("Error loading schedule", error.message);
    return { success: false, error: error.message };
  }
}

// Check if user is logged in
export async function isLoggedIn() {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}
