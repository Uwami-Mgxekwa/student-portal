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
  
  const totalModulesPerDay = 8; 

  timeTable.forEach((tTable) => {
    const column = document.createElement("table");
    column.classList.add("table-column");
    
    let tableHTML = `
      <thead>
        <tr class="column-header">
          <th>${tTable.DAY}</th>
        </tr>
      </thead>
      <tbody>
        <tr class="column-data">
    `;
    
    for (let i = 0; i < totalModulesPerDay; i++) {
      const moduleValue = (tTable.MODULES && tTable.MODULES[i]) ? tTable.MODULES[i] : '';
      tableHTML += `<td>${moduleValue}</td>`;
    }
    
    tableHTML += `
        </tr>
      </tbody>
    `;
    
    column.innerHTML = tableHTML;
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

  //let us use mock data for now till we figure it out 
  
  const mockScheduleData = {
    schedule: {
      COURSE: "Computer Science",
      CERTIFICATE: "Level 3",
      TABLE: [
        {
          DAY: "Monday",
          MODULES: ["Math", "Database", "Project", "Research", "Study"]
        },
        {
          DAY: "Tuesday",
          MODULES: ["English", "Physics", "Break", "Programming", "Research", "Study"]
        },
        {
          DAY: "Wednesday",
          MODULES: ["Math", "Computer Science", "Research", "Study"]
        },
        {
          DAY: "Thursday",
          MODULES: ["English", "Study"]
        },
        {
          DAY: "Friday",
          MODULES: ["Math", "Physics", "Break", "Programming","Research", "Study"]
        }
      ]
    }
  };

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
    // Use mock data as fallback
    console.log("Using mock data as fallback");
    resolve(mockScheduleData);
  };

  if (jsonStuInfo) {
    try {
      const studentData = JSON.parse(jsonStuInfo);
      console.log("Student data structure:", studentData);
      
      let course, certificate;
      

      //for debugging purposes 
      if (studentData.studentInfo && studentData.studentInfo.COURSE) {
        course = studentData.studentInfo.COURSE;
        certificate = studentData.studentInfo.CERTIFICATE;
      } else if (studentData.COURSE) {
        course = studentData.COURSE;
        certificate = studentData.CERTIFICATE;
      } else if (studentData.data && studentData.data.COURSE) {
        course = studentData.data.COURSE;
        certificate = studentData.data.CERTIFICATE;
      } else if (studentData.student && studentData.student.COURSE) {
        course = studentData.student.COURSE;
        certificate = studentData.student.CERTIFICATE;
      }
      
      if (!course || !certificate) {
        console.error("Could not find course and certificate in student data");
        onFail("Missing student course information");
        return;
      }
      
      const scheduleUrl = CONFIG.scheduleEP + `?course=${course}&certificate=${certificate}`;
      console.log("Fetching schedule from:", scheduleUrl);

      try {
        await getData(scheduleUrl, "stu-schedule", onSuccess, onFail);
        const jsonData = localStorage.getItem("stu-schedule");
        if (!jsonData) {
          throw new Error("Failed to retrieve schedule data");
        }
        const parsedData = JSON.parse(jsonData);
        resolve(parsedData);
      } catch (fetchError) {
        console.error("Error fetching schedule:", fetchError);
        onFail(fetchError.message);
      }
    } catch (error) {
      console.error("Error parsing student data:", error);
      showAlert("Session error", error.message);
      resolve(mockScheduleData);
    }
  } else {
    studentInfo();
    setTimeout(() => {
      removeLoading();
      resolve(mockScheduleData);
    }, 1500);
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
