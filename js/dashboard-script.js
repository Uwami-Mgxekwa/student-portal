import { isLoggedIn } from "../lib/check-login.js";
import { signOutStudent } from "../lib/auth.js";
const logOutBtn = document.getElementById("sign-out");
const greeting = document.getElementById("greeting");

document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();
  renderCalendar();
  updateLastUpdatedTime();
  renderAssignments();
  renderTrendingCourses();
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

function renderCalendar() {
  const calendar = document.getElementById("calendar");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  calendar.innerHTML = "";
  calendar.style = "position: relative; padding-top: 50px;";

  const monthName = document.createElement("h1");
  monthName.innerText = months[new Date().getMonth()];
  monthName.style = "position: absolute; top: 8px; left: 20px";
  calendar.appendChild(monthName);

  days.forEach((day) => {
    const dayElement = document.createElement("div");
    dayElement.textContent = day;
    dayElement.style.fontWeight = "bold";
    calendar.appendChild(dayElement);
  });

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.style.background = "#f5f5f5";
    calendar.appendChild(emptyDay);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = document.createElement("div");
    dayElement.textContent = i;
    if (i === currentDate.getDate()) {
      dayElement.style.background = "#e6f7ff";
      dayElement.style.fontWeight = "bold";
      dayElement.style.border = "1px solid #1890ff";
    }
    calendar.appendChild(dayElement);
  }
}

function updateLastUpdatedTime() {
  const lastUpdatedElement = document.getElementById("lastUpdated");
  if (lastUpdatedElement) {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    lastUpdatedElement.textContent = formattedDate;
  }
  setTimeout(updateLastUpdatedTime, 60000);
}

function renderAssignments() {
  const assignments = [
    {
      title: "Web Development Final Project",
      course: "Advanced Frontend Development",
      dueDate: "Mar 15, 2025",
      status: "In Progress",
    },
    {
      title: "Research Paper Submission",
      course: "Research Methodology",
      dueDate: "Mar 22, 2025",
      status: "Not Started",
    },
    {
      title: "Database Design Quiz",
      course: "Database Systems",
      dueDate: "Mar 12, 2025",
      status: "Upcoming",
    },
  ];

  const assignmentsList = document.getElementById("assignmentsList");
  assignmentsList.innerHTML = "";

  assignments.forEach((assignment) => {
    const card = document.createElement("div");
    card.className = "assignment-card";

    card.innerHTML = `
<div class="assignment-info">
  <div class="assignment-icon">
    <i class="fas fa-file-alt"></i>
  </div>
  <div class="assignment-details">
    <h3>${assignment.title}</h3>
    <p>${assignment.course}</p>
  </div>
</div>
<div class="assignment-meta">
  <span>Due: ${assignment.dueDate}</span>
  <span>${assignment.status}</span>
</div>
`;

    assignmentsList.appendChild(card);
  });
}

function renderTrendingCourses() {
  const courses = [
    {
      title: "Data Science Fundamentals",
      instructor: "Dr. J. Smith",
      students: 453,
    },
    {
      title: "Mobile App Development",
      instructor: "Prof. T. Johnson",
      students: 328,
    },
  ];

  const coursesList = document.getElementById("coursesList");
  if (coursesList) {
    coursesList.innerHTML = "";

    courses.forEach((course) => {
      const card = document.createElement("div");
      card.className = "course-card";

      card.innerHTML = `
<div class="course-card-header">
  <div class="course-info">
    <h4>${course.title}</h4>
    <p>${course.instructor}</p>
  </div>
  <span class="course-badge">${course.students} students</span>
</div>
`;

      coursesList.appendChild(card);
    });
  }
}

const showGreeting = () => {
  const jsonValue = localStorage.getItem("stu");
  if (jsonValue) {
    try {
      const studentDetails = JSON.parse(jsonValue);
      greeting.innerText =
        "Hi, " +
        studentDetails.first_name.toUpperCase() +
        " " +
        studentDetails.last_name.toUpperCase();
    } catch (e) {
      console.error("Error parsing student data:", e);
      greeting.innerText = "Hi, Student";
    }
  } else {
    localStorage.clear();
    location.href = "../index.html";
  }
};

document
  .querySelector(".nav-item.courses")
  .addEventListener("click", function () {
    window.location.href = "../pages/courses.html";
  });

document
  .querySelector(".nav-item.events")
  .addEventListener("click", function () {
    window.location.href = "../pages/events.html";
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

logOutBtn.addEventListener("click", () => {
  signOutStudent();
});

window.addEventListener("load", () => {
  if (isLoggedIn()) {
    showGreeting();
  } else {
    location.href = "../index.html";
  }
});
