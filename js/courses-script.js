import { isLoggedIn } from "../lib/supabase-auth.js";
import { showSignOutModal } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";

const logOutBtn = document.getElementById("sign-out");

document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();
  renderCourses();
  renderDeadlines();
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
  } else {
    sidebar.classList.remove("collapsed");
  }
}

function setupEventListeners() {
  document
    .querySelector(".nav-item:not(.active)")
    .addEventListener("click", function () {
      window.location.href = "../pages/dashboard.html";
    });

  document
    .querySelector(".nav-item.schedule")
    .addEventListener("click", function () {
      window.location.href = "../pages/schedule.html";
    });

  document
    .querySelector(".nav-item.resources")
    .addEventListener("click", function () {
      window.location.href = "../pages/resources.html";
    });

  document
    .querySelector(".nav-item.events")
    .addEventListener("click", function () {
      window.location.href = "../pages/events.html";
    });

  document
    .querySelector(".nav-item.settings")
    .addEventListener("click", function () {
      window.location.href = "../pages/settings.html";
    });
}

function renderCourses() {
  // Year 1 modules - will be dynamic based on student year later
  const enrolledCourses = [
    {
      id: 1,
      code: "PROG101",
      title: "Introduction to Programming",
      instructor: "Your Instructor Name",
      progress: 65,
      image: "../assets/programming.jpg",
      assignments: 3,
      tests: 2,
      averageMark: 75,
    },
    {
      id: 2,
      code: "DBMS101",
      title: "Introduction to Database Management Systems",
      instructor: "Your Instructor Name",
      progress: 58,
      image: "../assets/database.jpg",
      assignments: 2,
      tests: 1,
      averageMark: 82,
    },
  ];

  const enrolledCoursesContainer = document.getElementById("enrolledCourses");
  enrolledCoursesContainer.innerHTML = "";

  enrolledCourses.forEach((course) => {
    enrolledCoursesContainer.appendChild(createCourseCard(course));
  });
}

function createCourseCard(course) {
  const card = document.createElement("div");
  card.className = "course-card";

  const imagePath = course.image || "../assets/logo.png";

  card.innerHTML = `
    <div class="course-image">
      <img src="${imagePath}" alt="${course.title}" onerror="this.src='../assets/logo.png'">
      <div class="course-code">${course.code}</div>
    </div>
    <div class="course-content">
      <div class="course-title">${course.title}</div>
      <div class="course-instructor"><i class="fas fa-user"></i> ${course.instructor}</div>
      
      <div class="course-progress">
        <div class="progress-info">
          <span>Course Progress</span>
          <span>${course.progress || 0}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-value" style="width: ${course.progress || 0}%"></div>
        </div>
      </div>

      <div class="course-stats">
        <div class="stat-item">
          <i class="fas fa-tasks"></i>
          <span>${course.assignments} Assignments</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-file-alt"></i>
          <span>${course.tests} Tests</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-chart-line"></i>
          <span>Avg: ${course.averageMark}%</span>
        </div>
      </div>

      <button class="course-action-btn" onclick="viewCourseDetails('${course.code}', '${course.title}')">
        <i class="fas fa-eye"></i> View Details
      </button>
    </div>
  `;

  return card;
}

function renderDeadlines() {
  const deadlines = [
    {
      title: "Programming Assignment 2",
      course: "Introduction to Programming",
      date: "Nov 20, 2025",
    },
    {
      title: "Database Design Project",
      course: "Database Management Systems",
      date: "Nov 25, 2025",
    },
    {
      title: "Test 2 - Programming",
      course: "Introduction to Programming",
      date: "Dec 2, 2025",
    },
  ];

  const deadlinesList = document.getElementById("deadlinesList");
  if (!deadlinesList) return;

  deadlinesList.innerHTML = "";

  deadlines.forEach((deadline) => {
    const deadlineItem = document.createElement("div");
    deadlineItem.className = "deadline-item";

    deadlineItem.innerHTML = `
      <div class="deadline-date">${deadline.date}</div>
      <div class="deadline-title">${deadline.title}</div>
      <div class="deadline-course">${deadline.course}</div>
    `;

    deadlinesList.appendChild(deadlineItem);
  });
}

// Function to navigate to course details
window.viewCourseDetails = function(courseCode, courseTitle) {
  window.location.href = `../pages/course-details.html?code=${courseCode}&title=${encodeURIComponent(courseTitle)}`;
}

logOutBtn.addEventListener("click", () => {
  showSignOutModal();
});

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
