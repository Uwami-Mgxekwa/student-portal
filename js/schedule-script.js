import { isLoggedIn, getStudentInfo, getSchedule } from "../lib/supabase-auth.js";
import { showAlert, showSignOutModal } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";
const tableContainer = document.getElementById("table-container");
const logOutBtn = document.getElementById("sign-out");
const dateAndTime = document.getElementById("dateandtime");
const studentCourseHeading = document.getElementById("student-course");

document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();
  renderUpcomingAssessments();
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
  // Show loading in table container
  tableContainer.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 20px; color: var(--text); width: 100%; min-height: 400px;">
      <div class="loader"></div>
      <p style="margin-top: 20px;">Loading schedule...</p>
    </div>
  `;

  try {
    const studentResult = await getStudentInfo();
    if (!studentResult.success || !studentResult.studentInfo) {
      // Show friendly message instead of error
      studentCourseHeading.innerText = "Schedule Not Available";
      tableContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 20px; color: var(--text); width: 100%; min-height: 400px;">
          <i class="fas fa-calendar-times" style="font-size: 60px; margin-bottom: 20px; opacity: 0.5;"></i>
          <h3 style="margin-bottom: 10px;">No Schedule Found</h3>
          <p style="max-width: 500px;">Your academic information is not yet set up. Please contact the admissions office to complete your enrollment.</p>
        </div>
      `;
      return;
    }

    const { course, certificate, year } = studentResult.studentInfo;
    const scheduleResult = await getSchedule(course, certificate, year, false);
    
    if (scheduleResult.success) {
      tableContainer.innerHTML = ''; // Clear loading
      createTimeTable(scheduleResult.schedule.schedule_data);
    } else {
      // Show friendly message for missing schedule
      studentCourseHeading.innerText = "Schedule Not Available";
      tableContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 20px; color: var(--text); width: 100%; min-height: 400px;">
          <i class="fas fa-calendar-times" style="font-size: 60px; margin-bottom: 20px; opacity: 0.5;"></i>
          <h3 style="margin-bottom: 10px;">Schedule Not Found</h3>
          <p style="max-width: 500px;">No schedule is available for your course yet. Please check back later or contact support.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error loading schedule:", error);
    studentCourseHeading.innerText = "Error Loading Schedule";
    tableContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 20px; color: var(--text); width: 100%; min-height: 400px;">
        <i class="fas fa-exclamation-triangle" style="font-size: 60px; margin-bottom: 20px; color: #ef4444;"></i>
        <h3 style="margin-bottom: 10px;">Error Loading Schedule</h3>
        <p style="max-width: 500px;">${error.message}</p>
      </div>
    `;
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
  .querySelector(".nav-item.finances")
  .addEventListener("click", function () {
    window.location.href = "../pages/finances.html";
  });

document
  .querySelector(".nav-item.settings")
  .addEventListener("click", function () {
    window.location.href = "../pages/settings.html";
  });

logOutBtn.addEventListener("click", () => {
  showSignOutModal();
});

// Download PDF functionality
const downloadPdfBtn = document.getElementById("download-pdf-btn");
const printBtn = document.getElementById("print-btn");

if (downloadPdfBtn) {
  downloadPdfBtn.addEventListener("click", () => {
    const element = document.getElementById("table-container");
    const studentCourse = document.getElementById("student-course").innerText;
    
    const opt = {
      margin: 10,
      filename: `${studentCourse.replace(/\s+/g, '_')}_Timetable.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save();
  });
}

if (printBtn) {
  printBtn.addEventListener("click", () => {
    window.print();
  });
}

function renderUpcomingAssessments() {
  // Tests & Exams
  const testsExams = [
    {
      name: "SETA Final Exams",
      date: "December 1-12, 2025",
      type: "exam"
    }
  ];

  // Important Dates
  const importantDates = [
    {
      name: "Final Exams Begin",
      date: "December 1, 2025",
      icon: "fa-calendar-day"
    },
    {
      name: "Final Exams End",
      date: "December 12, 2025",
      icon: "fa-calendar-check"
    }
  ];

  // Render Tests & Exams
  const testsExamsContent = document.getElementById("testsExamsContent");
  if (testsExamsContent) {
    if (testsExams.length === 0) {
      testsExamsContent.innerHTML = '<p class="no-items">No upcoming tests or exams</p>';
    } else {
      testsExamsContent.innerHTML = `
        <ul class="upcoming-list">
          ${testsExams.map(item => `
            <li>
              <span class="item-name">${item.name}</span>
              <span class="upcoming-date">${item.date}</span>
            </li>
          `).join('')}
        </ul>
      `;
    }
  }

  // Render Important Dates
  const importantDatesContent = document.getElementById("importantDatesContent");
  if (importantDatesContent) {
    if (importantDates.length === 0) {
      importantDatesContent.innerHTML = '<p class="no-items">No important dates</p>';
    } else {
      importantDatesContent.innerHTML = `
        <ul class="upcoming-list">
          ${importantDates.map(item => `
            <li>
              <span class="item-name">
                <i class="fas ${item.icon}"></i> ${item.name}
              </span>
              <span class="upcoming-date">${item.date}</span>
            </li>
          `).join('')}
        </ul>
      `;
    }
  }
}

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
