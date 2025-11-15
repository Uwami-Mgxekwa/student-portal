import { isLoggedIn } from "../lib/supabase-auth.js";
import { showSignOutModal } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";

const logOutBtn = document.getElementById("sign-out");

// Sample data - will be replaced with database queries later
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

function loadCourseDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseCode = urlParams.get("code");

  if (!courseCode) {
    // No course code provided - show error message instead of redirecting
    document.getElementById("courseTitle").textContent = "No Course Selected";
    document.getElementById("courseCode").textContent = "Please select a course from the Courses page";
    console.error("No course code in URL. Add ?code=PROG101 to test");
    return;
  }

  if (!courseData[courseCode]) {
    // Course code not found - show error message
    document.getElementById("courseTitle").textContent = "Course Not Found";
    document.getElementById("courseCode").textContent = `Course code "${courseCode}" not found`;
    console.error("Available course codes:", Object.keys(courseData));
    return;
  }

  const course = courseData[courseCode];

  document.getElementById("courseTitle").textContent = course.title;
  document.getElementById("courseCode").textContent = courseCode;

  renderAssignments(course.assignments);
  renderTests(course.tests);
  updateStats(course);
}

function renderAssignments(assignments) {
  const tableBody = document.getElementById("assignmentsTable");
  tableBody.innerHTML = "";

  if (assignments.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px;">
          <i class="fas fa-inbox" style="font-size: 48px; opacity: 0.3; margin-bottom: 10px;"></i>
          <p>No assignments yet</p>
        </td>
      </tr>
    `;
    return;
  }

  assignments.forEach((assignment, index) => {
    const row = document.createElement("tr");
    
    const percentage = assignment.mark !== null ? ((assignment.mark / assignment.total) * 100).toFixed(1) : "--";
    const statusClass = assignment.status === "Submitted" ? "status-submitted" : "status-pending";
    const markDisplay = assignment.mark !== null ? assignment.mark : "--";
    const submittedDisplay = assignment.submittedDate 
      ? new Date(assignment.submittedDate).toLocaleDateString() 
      : "--";

    // Action button based on status
    let actionButton = "";
    if (assignment.status === "Pending") {
      actionButton = `
        <button class="submit-action-btn whatsapp-submit-btn" onclick="submitViaWhatsApp('${assignment.name}', '${course.name}')">
          <i class="fab fa-whatsapp"></i> Submit
        </button>
      `;
    } else {
      actionButton = `
        <button class="view-action-btn whatsapp-view-btn" onclick="viewViaWhatsApp('${assignment.name}', '${course.name}')">
          <i class="fab fa-whatsapp"></i> View
        </button>
      `;
    }

    row.innerHTML = `
      <td>${assignment.name}</td>
      <td>${new Date(assignment.dueDate).toLocaleDateString()}</td>
      <td><span class="status-badge ${statusClass}">${assignment.status}</span></td>
      <td>${submittedDisplay}</td>
      <td>${markDisplay}</td>
      <td>${assignment.total}</td>
      <td>${percentage}%</td>
      <td>${actionButton}</td>
    `;

    tableBody.appendChild(row);
  });
}

function renderTests(tests) {
  const tableBody = document.getElementById("testsTable");
  tableBody.innerHTML = "";

  if (tests.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px;">
          <i class="fas fa-inbox" style="font-size: 48px; opacity: 0.3; margin-bottom: 10px;"></i>
          <p>No tests yet</p>
        </td>
      </tr>
    `;
    return;
  }

  tests.forEach((test) => {
    const row = document.createElement("tr");
    
    const percentage = test.mark !== null ? ((test.mark / test.total) * 100).toFixed(1) : "--";
    const markDisplay = test.mark !== null ? test.mark : "--";
    const grade = test.mark !== null ? getGrade(percentage) : "--";

    row.innerHTML = `
      <td>${test.name}</td>
      <td>${new Date(test.date).toLocaleDateString()}</td>
      <td>${markDisplay}</td>
      <td>${test.total}</td>
      <td>${percentage}%</td>
      <td><span class="grade-badge grade-${grade.toLowerCase()}">${grade}</span></td>
    `;

    tableBody.appendChild(row);
  });
}

function updateStats(course) {
  const submittedAssignments = course.assignments.filter(a => a.status === "Submitted").length;
  const totalAssignments = course.assignments.length;
  
  const completedTests = course.tests.filter(t => t.mark !== null).length;
  const totalTests = course.tests.length;

  const allMarks = [
    ...course.assignments.filter(a => a.mark !== null).map(a => (a.mark / a.total) * 100),
    ...course.tests.filter(t => t.mark !== null).map(t => (t.mark / t.total) * 100),
  ];

  const averageMark = allMarks.length > 0 
    ? (allMarks.reduce((sum, mark) => sum + mark, 0) / allMarks.length).toFixed(1) 
    : "--";

  document.getElementById("averageMark").textContent = averageMark !== "--" ? `${averageMark}%` : "--";
  document.getElementById("assignmentsCompleted").textContent = `${submittedAssignments}/${totalAssignments}`;
  document.getElementById("testsCompleted").textContent = `${completedTests}/${totalTests}`;
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
let studentInfo = null;

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
  const message = encodeURIComponent(
    `Hi! I would like to submit my assignment:\n\n` +
    `Course: ${courseName}\n` +
    `Assignment: ${assignmentName}\n\n` +
    `I'm ready to send my work.`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
};

window.viewViaWhatsApp = function(assignmentName, courseName) {
  const phoneNumber = "27635722080";
  const message = encodeURIComponent(
    `Hi! I would like to check on my assignment:\n\n` +
    `Course: ${courseName}\n` +
    `Assignment: ${assignmentName}\n\n` +
    `Can I get feedback or my marks?`
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
