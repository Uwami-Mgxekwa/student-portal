import CONFIG from "../config/config.js";
import { signOutStudent, studentInfo } from "../lib/auth.js";
import { isLoggedIn } from "../lib/check-login.js";
import getData from "../lib/get-data.js";
import { showLoading, removeLoading } from "../lib/loading.js";
import { showAlert } from "../lib/pop-up.js";
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

const createTimeTable = (data) => {
  studentCourseHeading.innerText =
    data.schedule.COURSE + " " + data.schedule.CERTIFICATE;
  const timeTable = data.schedule.TABLE;

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

const getSchedule = new Promise(async (resolve, reject) => {
  showLoading("Verifying...");
  const jsonStuInfo = localStorage.getItem("stu-info");
  const jsonStuSchedule = localStorage.getItem("stu-schedule");

  if (jsonStuSchedule) {
    removeLoading();
    const parsedData = JSON.parse(jsonStuSchedule);
    resolve(parsedData);
    return;
  }

  const onSuccess = () => {
    removeLoading();
  };

  const onFail = (message) => {
    let title = "Verification Error";
    removeLoading();
    showAlert(title, message);
  };

  if (jsonStuInfo) {
    try {
      const studentInfo = JSON.parse(jsonStuInfo);
      const scheduleUrl =
        CONFIG.scheduleEP +
        `?course=${studentInfo.studentInfo.COURSE}&certificate=${studentInfo.studentInfo.CERTIFICATE}`;

      await getData(scheduleUrl, "stu-schedule", onSuccess, onFail);
      const jsonData = localStorage.getItem("stu-schedule");
      const parsedData = JSON.parse(jsonData);
      resolve(parsedData);
    } catch (error) {
      console.error("Error parsing student data:", error);
      showAlert("Session error", error.message);
      reject(error);
    }
  } else {
    studentInfo();
  }
});

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
  signOutStudent();
});

getSchedule
  .then((data) => {
    createTimeTable(data);
  })
  .catch((error) => {
    console.log(error);
  });

setInterval(() => {
  updateDateAndTime();
}, 1000);

window.addEventListener("load", () => {
  let currTheme = localStorage.getItem("theme");
  if (!currTheme) {
    currTheme = "light";
  }
  setTheme(currTheme);
  if (isLoggedIn()) {
  } else {
    location.href = "../index.html";
  }
});