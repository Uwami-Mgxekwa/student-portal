import { isLoggedIn } from "../lib/supabase-auth.js";
import { showSignOutModal } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";

const logOutBtn = document.getElementById("sign-out");

// Sample data - will be replaced with database queries later
const courseData = {
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

  if (!courseCode || !courseData[courseCode]) {
    window.location.href = "../pages/courses.html";
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
        <td colspan="7" style="text-align: center; padding: 40px;">
          <i class="fas fa-inbox" style="font-size: 48px; opacity: 0.3; margin-bottom: 10px;"></i>
          <p>No assignments yet</p>
        </td>
      </tr>
    `;
    return;
  }

  assignments.forEach((assignment) => {
    const row = document.createElement("tr");
    
    const percentage = assignment.mark !== null ? ((assignment.mark / assignment.total) * 100).toFixed(1) : "--";
    const statusClass = assignment.status === "Submitted" ? "status-submitted" : "status-pending";
    const markDisplay = assignment.mark !== null ? assignment.mark : "--";
    const submittedDisplay = assignment.submittedDate 
      ? new Date(assignment.submittedDate).toLocaleDateString() 
      : "--";

    row.innerHTML = `
      <td>${assignment.name}</td>
      <td>${new Date(assignment.dueDate).toLocaleDateString()}</td>
      <td><span class="status-badge ${statusClass}">${assignment.status}</span></td>
      <td>${submittedDisplay}</td>
      <td>${markDisplay}</td>
      <td>${assignment.total}</td>
      <td>${percentage}%</td>
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
