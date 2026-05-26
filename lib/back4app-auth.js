import { Parse } from "../config/back4app.js";
import { removeLoading, showLoading } from "./loading.js";
import { showAlert } from "./pop-up.js";

// Check if Parse loaded properly
if (!Parse) {
  console.error('❌ Parse client is not initialized. Check your internet connection and browser settings.');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getFacultyForCourse = (course) => {
  const facultyMap = {
    'Information Technology': 'Faculty of ICT',
    'Business Management': 'Faculty of Commerce',
    'Engineering': 'Faculty of Engineering',
    'Hospitality Management': 'Faculty of Tourism',
  };
  return facultyMap[course] || 'Faculty of General Studies';
};

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

    // Create auth user using studentID as username
    const user = new Parse.User();
    user.set("username", studentData.studentID);
    user.set("password", studentData.password);
    user.set("email", studentData.email);
    
    // Save additional student attributes to the User class
    user.set("student_id", studentData.studentID);
    user.set("first_name", studentData.first_name);
    user.set("last_name", studentData.last_name);
    user.set("phone", studentData.phone);
    user.set("address", studentData.address);
    user.set("gender", studentData.gender);

    await user.signUp();

    logSuccess('Auth User Created', { userId: user.id });

    // Insert student_info record (academic information)
    const StudentInfo = Parse.Object.extend("StudentInfo");
    const info = new StudentInfo();
    info.set("student_id", studentData.studentID);
    info.set("campus", 'Main Campus'); // Default campus
    info.set("course", studentData.course);
    info.set("faculty", getFacultyForCourse(studentData.course));
    info.set("certificate", studentData.certificate);
    info.set("year", studentData.year);

    await info.save();

    logSuccess('Student Record Created');
    logSuccess('Signup Complete', `Student ${studentData.studentID} registered with course: ${studentData.course}`);
    removeLoading();
    showAlert("Success", "Account created successfully! Your schedule is now available.", "success");
    return { success: true };

  } catch (error) {
    logError('Signup Failed', error);
    removeLoading();
    
    // User-friendly error messages
    let errorMessage = error.message;
    if (error.code === 202) {
      errorMessage = 'This username (Student ID) is already taken. Please use a different one.';
    } else if (error.code === 203) {
      errorMessage = 'This email is already registered. Please use a different email or try logging in.';
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

    // Sign in with username and password
    const user = await Parse.User.logIn(studentID, password);

    logSuccess('Login Successful', `Welcome ${user.get("first_name")}!`);
    removeLoading();
    return { success: true, user: user };

  } catch (error) {
    logError('Login Failed', error);
    removeLoading();
    let errorMessage = error.message;
    if (error.code === 101) {
      errorMessage = "Incorrect Student ID or password. Please try again.";
    }
    showAlert("Login error", errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Sign out student
export async function signOutStudent() {
  showLoading("Signing out...");

  try {
    await Parse.User.logOut();

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
export async function getStudentInfo(showLoadingOverlay = true) {
  if (showLoadingOverlay) {
    showLoading("Loading profile...");
  }

  try {
    logInfo('Profile Load Started', 'Fetching user data');

    const user = Parse.User.current();
    if (!user) throw new Error("Not authenticated");

    // Format the student record to match the previous structure
    const student = {
      id: user.id,
      student_id: user.get("student_id"),
      first_name: user.get("first_name"),
      last_name: user.get("last_name"),
      email: user.get("email"),
      phone: user.get("phone"),
      address: user.get("address"),
      gender: user.get("gender")
    };

    let studentInfo = null;
    try {
      const query = new Parse.Query("StudentInfo");
      query.equalTo("student_id", student.student_id);
      const info = await query.first();

      if (info) {
        studentInfo = {
          student_id: info.get("student_id"),
          campus: info.get("campus"),
          course: info.get("course"),
          faculty: info.get("faculty"),
          certificate: info.get("certificate"),
          year: info.get("year")
        };
        logInfo('Student Info Loaded', 'Additional info found');
      } else {
        logInfo('Student Info Empty', 'No additional info available');
      }
    } catch (err) {
      logInfo('Student Info Table Error', 'Skipping additional info');
    }

    logSuccess('Profile Loaded', `${student.first_name} ${student.last_name}`);
    if (showLoadingOverlay) {
      removeLoading();
    }
    return {
      success: true,
      student,
      studentInfo: studentInfo
    };

  } catch (error) {
    logError('Profile Load Failed', error);
    if (showLoadingOverlay) {
      removeLoading();
    }
    showAlert("Error loading profile", error.message);
    return { success: false, error: error.message };
  }
}

// Get schedule for student's course
export async function getSchedule(course, certificate, year = null, showLoadingOverlay = true) {
  if (showLoadingOverlay) {
    showLoading("Loading schedule...");
  }

  try {
    logInfo('Schedule Load Started', `Course: ${course}, Certificate: ${certificate}, Year: ${year}`);

    let data = null;

    // If year is provided, try to get year-specific schedule first
    if (year) {
      const yearQuery = new Parse.Query("Schedules");
      yearQuery.equalTo("course", course);
      yearQuery.equalTo("certificate", certificate);
      yearQuery.equalTo("year", parseInt(year));
      data = await yearQuery.first();
      
      if (data) {
        logSuccess('Schedule Loaded', `Year-specific schedule found for Year ${year}`);
      } else {
        logInfo('Year-specific schedule not found', 'Trying general schedule');
      }
    }
    
    // Get general schedule (year = 'all' or year = 1 as fallback) if specific year not found
    if (!data) {
      const q1 = new Parse.Query("Schedules");
      q1.equalTo("course", course);
      q1.equalTo("certificate", certificate);
      q1.equalTo("year", "all");

      const q2 = new Parse.Query("Schedules");
      q2.equalTo("course", course);
      q2.equalTo("certificate", certificate);
      q2.equalTo("year", 1);
      
      const fallbackQuery = Parse.Query.or(q1, q2);
      data = await fallbackQuery.first();

      if (data) {
        logSuccess('Schedule Loaded', 'General schedule retrieved');
      }
    }

    if (!data) {
      logInfo('Schedule Not Found', 'No schedule available for this course');
      if (showLoadingOverlay) {
        removeLoading();
      }
      return { 
        success: false, 
        error: 'No schedule available',
        notFound: true 
      };
    }

    if (showLoadingOverlay) {
      removeLoading();
    }
    return { success: true, schedule: data.toJSON() };

  } catch (error) {
    logError('Schedule Load Failed', error);
    if (showLoadingOverlay) {
      removeLoading();
    }
    return { success: false, error: error.message };
  }
}

// Check if user is logged in
export async function isLoggedIn() {
  const user = Parse.User.current();
  const loggedIn = !!user;
  logInfo('Session Check', loggedIn ? 'User is logged in' : 'No active session');
  return loggedIn;
}
