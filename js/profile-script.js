import { isLoggedIn, getStudentInfo } from "../lib/supabase-auth.js";
import { showSignOutModal } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";
const logOutBtn = document.getElementById("sign-out");

document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();
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

const showDetails = (student, studentInfo) => {
  const imageInfo = document.getElementById("info-image");
  const fullNameInfo = document.getElementById("info-fullname");
  const idInfo = document.getElementById("info-id");
  const campusInfo = document.getElementById("info-campus");
  const courseInfo = document.getElementById("info-course");
  const facultyInfo = document.getElementById("info-faculty");
  const certificateInfo = document.getElementById("info-certificate");
  const yearInfo = document.getElementById("info-year");
  const genderInfo = document.getElementById("info-gender");
  const emailInfo = document.getElementById("info-email");
  const phoneInfo = document.getElementById("info-phone");
  const addressInfo = document.getElementById("info-address");

  imageInfo.src = student.profile_image || "../assets/fallback-icon.png";
  fullNameInfo.innerText =
    student.first_name.toUpperCase() + " " + student.last_name.toUpperCase();
  idInfo.innerText = student.student_id;
  campusInfo.innerText = studentInfo?.campus?.toUpperCase() || "N/A";
  courseInfo.innerText = studentInfo?.course?.toUpperCase() || "N/A";
  facultyInfo.innerText = studentInfo?.faculty?.toUpperCase() || "N/A";
  certificateInfo.innerText = studentInfo?.certificate?.toUpperCase() || "N/A";
  yearInfo.innerText = studentInfo?.year || "N/A";
  genderInfo.innerText = student.gender?.toUpperCase() || "N/A";
  emailInfo.innerText = student.email;
  phoneInfo.innerText = student.phone || "N/A";
  addressInfo.innerText = student.address || "N/A";
};

const loadStudentProfile = async () => {
  const result = await getStudentInfo();
  if (result.success) {
    showDetails(result.student, result.studentInfo);
  }
};

document
  .querySelector(".nav-item.dashboard")
  .addEventListener("click", function () {
    window.location.href = "../pages/dashboard.html";
  });

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

document
  .querySelector(".nav-item.settings")
  .addEventListener("click", function () {
    window.location.href = "../pages/settings.html";
  });

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
  if (loggedIn) {
    await loadStudentProfile();
  } else {
    location.href = "../index.html";
  }
});
