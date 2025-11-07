import { supabase } from "../config/supabase.js";
import { removeLoading, showLoading } from "./loading.js";
import { showAlert } from "./pop-up.js";

// Sign up new student
export async function signUpStudent(studentData) {
  showLoading("Signing up...");
  
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: studentData.email,
      password: studentData.password,
      options: {
        data: {
          student_id: studentData.studentID,
          first_name: studentData.first_name,
          last_name: studentData.last_name,
        }
      }
    });

    if (authError) throw authError;

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

    removeLoading();
    return { success: true };
  } catch (error) {
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
    
    // Get email from student_id
    const { data: studentData, error: fetchError } = await supabase
      .from('students')
      .select('email')
      .eq('student_id', studentID)
      .single();

    console.log("Student lookup result:", studentData, fetchError);

    if (fetchError) {
      console.error("Student lookup failed:", fetchError);
      throw new Error("Student ID not found. Please check your Student ID or sign up first.");
    }

    if (!studentData || !studentData.email) {
      throw new Error("Student record found but email is missing");
    }

    console.log("Attempting login with email:", studentData.email);

    // Sign in with email
    const { data, error } = await supabase.auth.signInWithPassword({
      email: studentData.email,
      password: password,
    });

    console.log("Login attempt result:", data, error);

    if (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid password or account not found. Please check your credentials.");
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
