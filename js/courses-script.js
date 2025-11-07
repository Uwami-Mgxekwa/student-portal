import { isLoggedIn } from "../lib/supabase-auth.js";
import { showSignOutModal } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";

const logOutBtn = document.getElementById("sign-out");
const courseSearch = document.getElementById("courseSearch");
const courseFilter = document.getElementById("courseFilter");
const tabs = document.querySelectorAll(".tab");
const coursesGrids = document.querySelectorAll(".courses-grid");

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
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));

      tab.classList.add("active");

      coursesGrids.forEach((grid) => grid.classList.add("hidden"));

      const tabName = tab.getAttribute("data-tab");
      document.getElementById(`${tabName}Courses`).classList.remove("hidden");
    });
  });

  courseSearch.addEventListener("input", filterCourses);

  courseFilter.addEventListener("change", filterCourses);

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

function filterCourses() {
  const searchTerm = courseSearch.value.toLowerCase();
  const filterValue = courseFilter.value;

  const courseCards = document.querySelectorAll(".course-card");

  courseCards.forEach((card) => {
    const title = card.querySelector(".course-title").textContent.toLowerCase();
    const instructor = card
      .querySelector(".course-instructor")
      .textContent.toLowerCase();
    const status = card.getAttribute("data-status");

    const matchesSearch =
      title.includes(searchTerm) || instructor.includes(searchTerm);

    const matchesFilter = filterValue === "all" || status === filterValue;

    if (matchesSearch && matchesFilter) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

function renderCourses() {
  const enrolledCourses = [
    {
      id: 1,
      title: "Advanced Frontend Development",
      instructor: "Dr. Owami",
      progress: 75,
      status: "active",
      image: "../assets/web-dev.jpg",
      lessons: 24,
      duration: "8 weeks",
    },
    {
      id: 2,
      title: "Database Systems",
      instructor: "Prof. Michael Chang",
      progress: 45,
      status: "active",
      image: "../assets/database.jpg",
      lessons: 18,
      duration: "6 weeks",
    },
    {
      id: 3,
      title: "Research Methodology",
      instructor: "Dr. Emily Roberts",
      progress: 30,
      status: "active",
      image: "../assets/research.jpg",
      lessons: 12,
      duration: "10 weeks",
    },
  ];

  const recommendedCourses = [
    {
      id: 4,
      title: "Mobile App Development",
      instructor: "Prof. T. Johnson",
      status: "upcoming",
      image: "../assets/mobile.jpg",
      lessons: 22,
      duration: "8 weeks",
    },
    {
      id: 5,
      title: "Data Science Fundamentals",
      instructor: "Dr. J. Smith",
      status: "upcoming",
      image: "../assets/data-science.jpg",
      lessons: 28,
      duration: "12 weeks",
    },
  ];

  const completedCourses = [
    {
      id: 6,
      title: "Introduction to Programming",
      instructor: "Prof. Alan Turing",
      progress: 100,
      status: "completed",
      image: "../assets/programming.jpg",
      lessons: 16,
      duration: "6 weeks",
    },
    {
      id: 7,
      title: "Web Design Fundamentals",
      instructor: "Sarah Williams",
      progress: 100,
      status: "completed",
      image: "../assets/web-design.jpg",
      lessons: 14,
      duration: "4 weeks",
    },
  ];

  const enrolledCoursesContainer = document.getElementById("enrolledCourses");
  enrolledCoursesContainer.innerHTML = "";

  enrolledCourses.forEach((course) => {
    enrolledCoursesContainer.appendChild(createCourseCard(course));
  });

  const recommendedCoursesContainer =
    document.getElementById("recommendedCourses");
  recommendedCoursesContainer.innerHTML = "";

  recommendedCourses.forEach((course) => {
    recommendedCoursesContainer.appendChild(createCourseCard(course));
  });

  const completedCoursesContainer = document.getElementById("completedCourses");
  completedCoursesContainer.innerHTML = "";

  completedCourses.forEach((course) => {
    completedCoursesContainer.appendChild(createCourseCard(course));
  });
}

function createCourseCard(course) {
  const card = document.createElement("div");
  card.className = "course-card";
  card.setAttribute("data-status", course.status);

  const imagePath = course.image || "../assets/logo.png";

  let statusClass = "";
  let statusText = "";

  switch (course.status) {
    case "active":
      statusClass = "status-active";
      statusText = "Active";
      break;
    case "upcoming":
      statusClass = "status-upcoming";
      statusText = "Upcoming";
      break;
    case "completed":
      statusClass = "status-completed";
      statusText = "Completed";
      break;
  }

  const progressHtml =
    course.status !== "upcoming"
      ? `
    <div class="course-progress">
      <div class="progress-info">
        <span>Progress</span>
        <span>${course.progress || 0}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-value" style="width: ${course.progress || 0}%"></div>
      </div>
    </div>
  `
      : "";

  let actionButton = "";
  if (course.status === "active") {
    actionButton = `<div class="course-action">Continue</div>`;
  } else if (course.status === "upcoming") {
    actionButton = `<div class="course-action">Enroll</div>`;
  } else if (course.status === "completed") {
    actionButton = `<div class="course-action">Review</div>`;
  }

  card.innerHTML = `
    <div class="course-image">
      <img src="${imagePath}" alt="${course.title}" onerror="this.src='../assets/courses/default.jpg'">
      <div class="course-status ${statusClass}">${statusText}</div>
    </div>
    <div class="course-content">
      <div class="course-title">${course.title}</div>
      <div class="course-instructor">${course.instructor}</div>
      ${progressHtml}
      <div class="course-footer">
        <div class="course-badge">
          <i class="fas fa-book"></i>
          <span>${course.lessons} lessons</span>
        </div>
        <div class="course-badge">
          <i class="fas fa-clock"></i>
          <span>${course.duration}</span>
        </div>
      </div>
      <div class="course-footer" style="margin-top: 12px;">
        ${actionButton}
      </div>
    </div>
  `;

  card.addEventListener("click", () => {
    // window.location.href = `../pages/course-details.html?id=${course.id}`;
    console.log(`Clicked on course: ${course.title}`);
  });

  return card;
}

function renderDeadlines() {
  const deadlines = [
    {
      title: "Web Development Final Project",
      course: "Advanced Frontend Development",
      date: "Mar 15, 2025",
    },
    {
      title: "Database Quiz",
      course: "Database Systems",
      date: "Mar 12, 2025",
    },
    {
      title: "Research Paper Submission",
      course: "Research Methodology",
      date: "Mar 22, 2025",
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
