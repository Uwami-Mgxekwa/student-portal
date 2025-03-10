import { isLoggedIn } from "../lib/check-login.js";
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

const showDetails = (stuData, stuDataInfo) => {
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

  imageInfo.src = stuData.profileImage || "../assets/fallback-icon.png";
  fullNameInfo.innerText =
    stuData.first_name.toUpperCase() + " " + stuData.last_name.toUpperCase();
  idInfo.innerText = stuDataInfo.studentInfo.ID;
  campusInfo.innerText = stuDataInfo.studentInfo.CAMPUS.toUpperCase();
  courseInfo.innerText = stuDataInfo.studentInfo.COURSE.toUpperCase();
  facultyInfo.innerText = stuDataInfo.studentInfo.FACULTY.toUpperCase();
  certificateInfo.innerText = stuDataInfo.studentInfo.CERTIFICATE.toUpperCase();
  yearInfo.innerText = stuDataInfo.studentInfo.YEAR;
  genderInfo.innerText = stuDataInfo.studentInfo.GENDER.toUpperCase();
  emailInfo.innerText = stuDataInfo.studentInfo.EMAIL;
  phoneInfo.innerText = stuDataInfo.studentInfo.PHONE;
  addressInfo.innerText = stuData.address;
};

const getStudentInfo = async () => {
  const jsonStu = localStorage.getItem("stu");
  const jsonStuInfo = localStorage.getItem("stu-info");

  if (jsonStu && jsonStuInfo) {
    const parsedStuData = JSON.parse(jsonStu);
    const parsedStuInfoData = JSON.parse(jsonStuInfo);
    showDetails(parsedStuData, parsedStuInfoData);
  } else {
    studentInfo();
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

window.addEventListener("load", () => {
  let currTheme = localStorage.getItem("theme");
  if (!currTheme) {
    currTheme = "light";
  }
  setTheme(currTheme);
  getStudentInfo();
  if (!isLoggedIn()) {
    location.href = "../index.html";
  }
});
