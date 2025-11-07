import { isLoggedIn, getStudentInfo, getSchedule } from "../lib/supabase-auth.js";
import { showAlert, showSignOutModal } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";
const tableContainer = document.getElementById("table-container");
const logOutBtn = document.getElementById("sign-out");
const dateAndTime = document.getElementById("dateandtime");
const studentCourseHeading = document.getElementById("student-course");

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

const createTimeTable = (scheduleData) => {
  studentCourseHeading.innerText =
    scheduleData.COURSE + " " + scheduleData.CERTIFICATE;
  const timeTable = scheduleData.TABLE;

  timeTable.forEach((tTable) => {
    const column = document.createElement("table");
    column.classList.add("table-column");
    column.innerHTML = `
<thead>
  <tr class="column-header">
    <th>
      ${tTable.DAY} 
    </th>
  </tr>
</thead>
<tbody>
  <tr class="column-data" >

    <td>${tTable.MODULES[0]}</td>
    <td>${tTable.MODULES[1]}</td>
    <td>${tTable.MODULES[2]}</td>
    <td>${tTable.MODULES[3]}</td>
    <td>${tTable.MODULES[4]}</td>
    <td>${tTable.MODULES[5]}</td>
    <td>${tTable.MODULES[6]}</td>
    <td>${tTable.MODULES[7]}</td>
  </tr>
</tbody>
`;
    tableContainer.appendChild(column);
  });
};

const updateDateAndTime = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date();
  const dayDate = date.getDate();
  const day = days[date.getDay()];
  const month = months[date.getMonth()];

  const hour = date.getHours();
  const min = date.getMinutes();

  dateAndTime.innerText = `${day} ${dayDate} ${month} | ${hour < 10 ? "0" + hour : hour}:${min < 10 ? "0" + min : min}`;
};

const loadScheduleData = async () => {
  try {
    const studentResult = await getStudentInfo();
    if (!studentResult.success || !studentResult.studentInfo) {
      showAlert("Error", "Student information not found");
      return;
    }

    const { course, certificate } = studentResult.studentInfo;
    const scheduleResult = await getSchedule(course, certificate);
    
    if (scheduleResult.success) {
      createTimeTable(scheduleResult.schedule.schedule_data);
    }
  } catch (error) {
    console.error("Error loading schedule:", error);
    showAlert("Error", error.message);
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

setInterval(() => {
  updateDateAndTime();
}, 1000);

window.addEventListener("load", async () => {
  let currTheme = localStorage.getItem("theme");
  if (!currTheme) {
    currTheme = "light";
  }
  setTheme(currTheme);
  
  const loggedIn = await isLoggedIn();
  if (loggedIn) {
    await loadScheduleData();
  } else {
    location.href = "../index.html";
  }
});
