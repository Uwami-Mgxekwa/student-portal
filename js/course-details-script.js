import { isLoggedIn, getStudentInfo } from "../lib/supabase-auth.js";
import { showSignOutModal } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";
import { supabase } from "../config/supabase.js";

const logOutBtn = document.getElementById("sign-out");

// Store current course data
let currentCourse = null;
let currentAssignments = [];
let studentInfo = null;

// Old sample data - keeping for reference but not using
const courseData = {
  // Year 1 Courses
  "PROG101": {
    title: "Introduction to Programming",
    code: "PROG101",
    instructor: "Your Instructor Name",
    assignments: [
      {
        name: "Assignment 1: Variables and Data Types",
        dueDate: "2025-10-15",
        status: "Submitted",
        submittedDate: "2025-10-14",
        mark: 85,
        total: 100,
      },
      {
        name: "Assignment 2: Control Structures",
        dueDate: "2025-11-05",
        status: "Submitted",
        submittedDate: "2025-11-04",
        mark: 78,
        total: 100,
      },
      {
        name: "Assignment 3: Functions and Arrays",
        dueDate: "2025-11-20",
        status: "Pending",
        submittedDate: null,
        mark: null,
        total: 100,
      },
    ],
    tests: [
      {
        name: "Test 1: Programming Basics",
        date: "2025-10-20",
        mark: 72,
        total: 100,
      },
      {
        name: "Test 2: Advanced Concepts",
        date: "2025-12-02",
        mark: null,
        total: 100,
      },
    ],
  },
  "DBMS101": {
    title: "Introduction to Database Management Systems",
    code: "DBMS101",
    instructor: "Your Instructor Name",
    assignments: [
      {
        name: "Assignment 1: ER Diagrams",
        dueDate: "2025-10-18",
        status: "Submitted",
        submittedDate: "2025-10-17",
        mark: 90,
        total: 100,
      },
      {
        name: "Assignment 2: SQL Queries",
        dueDate: "2025-11-25",
        status: "Pending",
        submittedDate: null,
        mark: null,
        total: 100,
      },
    ],
    tests: [
      {
        name: "Test 1: Database Fundamentals",
        date: "2025-10-25",
        mark: 88,
        total: 100,
      },
    ],
  },
  // Year 2 Courses
  "PROG201": {
    title: "Advanced Programming II",
    code: "PROG201",
    instructor: "Your Instructor Name",
    assignments: [
      {
        name: "Assignment 1: Object-Oriented Programming",
        dueDate: "2025-10-12",
        status: "Submitted",
        submittedDate: "2025-10-11",
        mark: 72,
        total: 100,
      },
      {
        name: "Assignment 2: Data Structures",
        dueDate: "2025-11-08",
        status: "Submitted",
        submittedDate: "2025-11-07",
        mark: 65,
        total: 100,
      },
      {
        name: "Assignment 3: Algorithms",
        dueDate: "2025-11-22",
        status: "Pending",
        submittedDate: null,
        mark: null,
        total: 100,
      },
      {
        name: "Assignment 4: Final Project",
        dueDate: "2025-12-10",
        status: "Pending",
        submittedDate: null,
        mark: null,
        total: 100,
      },
    ],
    tests: [
      {
        name: "Test 1: OOP Concepts",
        date: "2025-10-18",
        mark: 68,
        total: 100,
      },
      {
        name: "Test 2: Advanced Topics",
        date: "2025-12-01",
        mark: null,
        total: 100,
      },
    ],
  },
  "WEB201": {
    title: "Web Development",
    code: "WEB201",
    instructor: "Your Instructor Name",
    assignments: [
      {
        name: "Assignment 1: HTML & CSS",
        dueDate: "2025-10-20",
        status: "Submitted",
        submittedDate: "2025-10-19",
        mark: 82,
        total: 100,
      },
      {
        name: "Assignment 2: JavaScript Basics",
        dueDate: "2025-11-15",
        status: "Submitted",
        submittedDate: "2025-11-14",
        mark: 75,
        total: 100,
      },
      {
        name: "Assignment 3: Web Application",
        dueDate: "2025-11-28",
        status: "Pending",
        submittedDate: null,
        mark: null,
        total: 100,
      },
    ],
    tests: [
      {
        name: "Test 1: Frontend Fundamentals",
        date: "2025-10-28",
        mark: 78,
        total: 100,
      },
    ],
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();
  loadCourseDetails();
  setupTabs();
  setupEventListeners();
});

function initializeSidebar() {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  const isMobile = () => window.innerWidth <= 768;

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  overlay.addEventListener("click", () => {
    if (isMobile()) {
      sidebar.classList.add("collapsed");
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) {
      sidebar.classList.remove("collapsed");
    } else {
      sidebar.classList.add("collapsed");
    }
  });

  if (isMobile()) {
    sidebar.classList.add("collapsed");
  }
}

function setupTabs() {
  const tabs = document.querySelectorAll(".detail-tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");
      const tabName = tab.getAttribute("data-tab");
      document.getElementById(`${tabName}Content`).classList.add("active");
    });
  });
}

function setupEventListeners() {
  document.querySelector(".nav-item:not(.active)").addEventListener("click", function () {
    window.location.href = "../pages/dashboard.html";
  });

  document.querySelector(".nav-item.courses").addEventListener("click", function () {
    window.location.href = "../pages/courses.html";
  });

  document.querySelector(".nav-item.schedule").addEventListener("click", function () {
    window.location.href = "../pages/schedule.html";
  });

  document.querySelector(".nav-item.resources").addEventListener("click", function () {
    window.location.href = "../pages/resources.html";
  });

  document.querySelector(".nav-item.events").addEventListener("click", function () {
    window.location.href = "../pages/events.html";
  });

  document.querySelector(".nav-item.settings").addEventListener("click", function () {
    window.location.href = "../pages/settings.html";
  });

  logOutBtn.addEventListener("click", () => {
    showSignOutModal();
  });
}

async function loadCourseDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseCode = urlParams.get("code");
  const courseTitle = urlParams.get("title");

  if (!courseCode) {
    document.getElementById("courseTitle").textContent = "No Course Selected";
    document.getElementById("courseCode").textContent = "Please select a course from the Courses page";
    showEmptyState();
    return;
  }

  try {
    // Get student info first
    const studentResult = await getStudentInfo();
    if (studentResult.success) {
      studentInfo = studentResult.studentInfo;
    }

    // Fetch course from database
    const { data: courses, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('course_code', courseCode)
      .single();

    if (courseError || !courses) {
      // Try by course name if code doesn't match
      const { data: coursesByName, error: nameError } = await supabase
        .from('courses')
        .select('*')
        .ilike('course_name', courseTitle || courseCode)
        .limit(1)
        .single();

      if (nameError || !coursesByName) {
        document.getElementById("courseTitle").textContent = courseTitle || "Course Not Found";
        document.getElementById("courseCode").textContent = courseCode ? `Code: ${courseCode}` : "Course not available in database";
        showEmptyState();
        return;
      }
      
      currentCourse = coursesByName;
    } else {
      currentCourse = courses;
    }

    // Display course info
    document.getElementById("courseTitle").textContent = currentCourse.course_name;
    document.getElementById("courseCode").textContent = currentCourse.course_code || courseCode;
    
    // Show description if available
    const descriptionEl = document.getElementById("courseDescription");
    if (currentCourse.description) {
      descriptionEl.textContent = currentCourse.description;
      descriptionEl.style.display = "block";
    } else {
      descriptionEl.style.display = "none";
    }

    // Fetch assignments for this course
    await loadAssignments();
    
    // Tests are not implemented yet - show placeholder
    renderTestsPlaceholder();

  } catch (error) {
    console.error('Error loading course details:', error);
    document.getElementById("courseTitle").textContent = "Error Loading Course";
    document.getElementById("courseCode").textContent = "Please try again later";
    showEmptyState();
  }
}

async function loadAssignments() {
  if (!currentCourse || !studentInfo) {
    renderAssignments([]);
    return;
  }

  try {
    const { data: assignments, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('course', currentCourse.course_name)
      .eq('is_active', true)
      .order('due_date', { ascending: true });

    if (error) throw error;

    // Filter by student year
    const filteredAssignments = assignments?.filter(assignment => 
      assignment.target_year === 'all' || assignment.target_year === String(studentInfo.year)
    ) || [];

    currentAssignments = filteredAssignments;
    renderAssignments(filteredAssignments);
    updateStats(filteredAssignments);

  } catch (error) {
    console.error('Error loading assignments:', error);
    renderAssignments([]);
  }
}

function showEmptyState() {
  document.getElementById("averageMark").textContent = "--";
  document.getElementById("assignmentsCompleted").textContent = "0/0";
  document.getElementById("testsCompleted").textContent = "0/0";
  renderAssignments([]);
  renderTestsPlaceholder();
}

function renderAssignments(assignments) {
  const tableBody = document.getElementById("assignmentsTable");
  tableBody.innerHTML = "";

  if (!assignments || assignments.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px;">
          <i class="fas fa-inbox" style="font-size: 48px; opacity: 0.3; margin-bottom: 10px; display: block;"></i>
          <p style="margin: 10px 0; color: var(--text-secondary); font-weight: 600;">No assignments available yet</p>
          <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 15px;">Assignments will appear here once your instructor creates them</p>
          <button class="whatsapp-contact-btn" onclick="contactInstructor()" style="margin-top: 10px; padding: 8px 16px; background: #25D366; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
            <i class="fab fa-whatsapp"></i> Contact Instructor
          </button>
        </td>
      </tr>
    `;
    return;
  }

  assignments.forEach((assignment) => {
    const row = document.createElement("tr");
    
    const dueDate = new Date(assignment.due_date);
    const today = new Date();
    const isPastDue = dueDate < today;
    
    // Determine status (for now, all are pending since we don't track submissions yet)
    const status = "Pending";
    const statusClass = isPastDue ? "status-overdue" : "status-pending";
    
    // Priority indicator
    const priorityClass = assignment.priority || 'medium';
    const priorityIcon = assignment.priority === 'high' ? '<i class="fas fa-exclamation-circle" style="color: #ef4444;"></i> ' : '';

    // Action button - WhatsApp submission
    const actionButton = `
      <button class="submit-action-btn whatsapp-submit-btn" onclick="submitViaWhatsApp('${escapeHtml(assignment.title)}', '${escapeHtml(currentCourse?.course_name || '')}')">
        <i class="fab fa-whatsapp"></i> Submit
      </button>
    `;

    row.innerHTML = `
      <td>${priorityIcon}${assignment.title}</td>
      <td>${dueDate.toLocaleDateString()}</td>
      <td><span class="status-badge ${statusClass}">${isPastDue ? 'Overdue' : status}</span></td>
      <td>--</td>
      <td>--</td>
      <td>100</td>
      <td>--</td>
      <td>${actionButton}</td>
    `;

    tableBody.appendChild(row);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderTestsPlaceholder() {
  const tableBody = document.getElementById("testsTable");
  tableBody.innerHTML = `
    <tr>
      <td colspan="6" style="text-align: center; padding: 40px;">
        <i class="fas fa-clock" style="font-size: 48px; opacity: 0.3; margin-bottom: 10px; display: block;"></i>
        <p style="margin: 10px 0; color: var(--text-secondary); font-weight: 600;">Test Marks Coming Soon</p>
        <p style="font-size: 14px; color: var(--text-secondary);">Test marks and grades will be available here once published by your instructor</p>
      </td>
    </tr>
  `;
}

function updateStats(assignments) {
  const totalAssignments = assignments.length;
  const today = new Date();
  const overdueAssignments = assignments.filter(a => new Date(a.due_date) < today).length;
  
  // For now, we don't track submissions, so show total/overdue info
  document.getElementById("averageMark").textContent = "--";
  document.getElementById("assignmentsCompleted").textContent = `0/${totalAssignments}`;
  document.getElementById("testsCompleted").textContent = overdueAssignments > 0 ? `${overdueAssignments} Overdue` : "0/0";
}

function getGrade(percentage) {
  const percent = parseFloat(percentage);
  if (percent >= 75) return "A";
  if (percent >= 70) return "B";
  if (percent >= 60) return "C";
  if (percent >= 50) return "D";
  return "F";
}

// Global variables for modal
let currentAssignmentIndex = null;
let currentCourseCode = null;

// Open submission modal
window.openSubmissionModal = async function(assignmentIndex) {
  currentAssignmentIndex = assignmentIndex;
  const urlParams = new URLSearchParams(window.location.search);
  currentCourseCode = urlParams.get("code");
  
  if (!currentCourseCode || !courseData[currentCourseCode]) {
    return;
  }

  const course = courseData[currentCourseCode];
  const assignment = course.assignments[assignmentIndex];

  // Get student info
  const result = await getStudentInfo();
  if (result.success) {
    studentInfo = result.student;
  }

  // Populate modal
  document.getElementById("modalCourse").textContent = `${course.title} (${course.code})`;
  document.getElementById("modalAssignment").textContent = assignment.name;
  document.getElementById("modalDueDate").textContent = new Date(assignment.dueDate).toLocaleDateString();
  document.getElementById("modalStudentName").textContent = studentInfo 
    ? `${studentInfo.first_name} ${studentInfo.last_name}` 
    : "Loading...";
  document.getElementById("modalStudentID").textContent = studentInfo?.student_id || "Loading...";

  // Check if late submission
  const dueDate = new Date(assignment.dueDate);
  const today = new Date();
  if (today > dueDate) {
    document.getElementById("lateWarning").style.display = "flex";
  } else {
    document.getElementById("lateWarning").style.display = "none";
  }

  // Show modal
  document.getElementById("submissionModal").classList.add("active");
  document.body.style.overflow = "hidden";
};

// Close modal
function closeSubmissionModal() {
  document.getElementById("submissionModal").classList.remove("active");
  document.body.style.overflow = "auto";
  document.getElementById("submissionForm").reset();
  document.getElementById("fileSelected").style.display = "none";
  document.querySelector(".file-upload-info").style.display = "block";
  currentAssignmentIndex = null;
}

// WhatsApp submission functions
window.submitViaWhatsApp = function(assignmentName, courseName) {
  const phoneNumber = "27635722080"; // South African format
  const studentName = studentInfo ? `${studentInfo.first_name} ${studentInfo.last_name}` : 'Student';
  const studentId = studentInfo ? studentInfo.student_id : 'N/A';
  
  const message = encodeURIComponent(
    `Hi! I would like to submit my assignment:\n\n` +
    `Student: ${studentName}\n` +
    `Student ID: ${studentId}\n` +
    `Course: ${courseName}\n` +
    `Assignment: ${assignmentName}\n\n` +
    `I'm ready to send my work.`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
};

window.viewViaWhatsApp = function(assignmentName, courseName) {
  const phoneNumber = "27635722080";
  const studentName = studentInfo ? `${studentInfo.first_name} ${studentInfo.last_name}` : 'Student';
  const studentId = studentInfo ? studentInfo.student_id : 'N/A';
  
  const message = encodeURIComponent(
    `Hi! I would like to check on my assignment:\n\n` +
    `Student: ${studentName}\n` +
    `Student ID: ${studentId}\n` +
    `Course: ${courseName}\n` +
    `Assignment: ${assignmentName}\n\n` +
    `Can I get feedback or my marks?`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
};

window.contactInstructor = function() {
  const phoneNumber = "27635722080";
  const studentName = studentInfo ? `${studentInfo.first_name} ${studentInfo.last_name}` : 'Student';
  const studentId = studentInfo ? studentInfo.student_id : 'N/A';
  const courseName = currentCourse ? currentCourse.course_name : 'Course';
  
  const message = encodeURIComponent(
    `Hi! I have a question about my course:\n\n` +
    `Student: ${studentName}\n` +
    `Student ID: ${studentId}\n` +
    `Course: ${courseName}\n\n` +
    `I would like to know about upcoming assignments and course materials.`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
};

// File upload handling
document.addEventListener("DOMContentLoaded", () => {
  const fileUpload = document.getElementById("fileUpload");
  const fileSelected = document.getElementById("fileSelected");
  const fileUploadInfo = document.querySelector(".file-upload-info");
  const removeFileBtn = document.getElementById("removeFile");

  fileUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        fileUpload.value = "";
        return;
      }

      // Validate file type
      const allowedTypes = [".pdf", ".doc", ".docx"];
      const fileExtension = "." + file.name.split(".").pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        alert("Only PDF, DOC, and DOCX files are allowed");
        fileUpload.value = "";
        return;
      }

      // Display file info
      document.getElementById("fileName").textContent = file.name;
      document.getElementById("fileSize").textContent = formatFileSize(file.size);
      fileUploadInfo.style.display = "none";
      fileSelected.style.display = "flex";
    }
  });

  removeFileBtn.addEventListener("click", () => {
    fileUpload.value = "";
    fileSelected.style.display = "none";
    fileUploadInfo.style.display = "block";
  });

  // Modal close handlers
  document.getElementById("closeModal").addEventListener("click", closeSubmissionModal);
  document.getElementById("cancelSubmit").addEventListener("click", closeSubmissionModal);

  // Click outside modal to close
  document.getElementById("submissionModal").addEventListener("click", (e) => {
    if (e.target.id === "submissionModal") {
      closeSubmissionModal();
    }
  });

  // Form submission
  document.getElementById("submissionForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById("fileUpload");
    const comments = document.getElementById("comments").value;
    const declaration = document.getElementById("declaration").checked;

    if (!fileInput.files[0]) {
      alert("Please select a file to upload");
      return;
    }

    if (!declaration) {
      alert("Please confirm the declaration");
      return;
    }

    // Disable submit button
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    try {
      // Here you would upload to Supabase Storage and save to database
      // For now, we'll simulate the submission
      await simulateSubmission(fileInput.files[0], comments);

      // Update assignment status
      const course = courseData[currentCourseCode];
      course.assignments[currentAssignmentIndex].status = "Submitted";
      course.assignments[currentAssignmentIndex].submittedDate = new Date().toISOString().split('T')[0];

      // Show success message
      alert("Assignment submitted successfully!");

      // Close modal and refresh
      closeSubmissionModal();
      renderAssignments(course.assignments);
      updateStats(course);

    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit assignment. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Assignment';
    }
  });
});

// Simulate submission (replace with actual Supabase upload later)
async function simulateSubmission(file, comments) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("File:", file.name);
      console.log("Comments:", comments);
      console.log("Student:", studentInfo);
      console.log("Course:", currentCourseCode);
      console.log("Assignment Index:", currentAssignmentIndex);
      resolve();
    }, 1500);
  });
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

window.addEventListener("load", async () => {
  let currTheme = localStorage.getItem("theme");
  if (!currTheme) {
    currTheme = "light";
  }
  setTheme(currTheme);
  
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    location.href = "../index.html";
  }
});
