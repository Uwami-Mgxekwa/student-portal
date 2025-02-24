import { signOutStudent } from "../lib/auth.js";
const tableContainer = document.getElementById("table-container");
const logOutBtn = document.getElementById("sign-out");
const dateAndTime = document.getElementById("dateandtime");

const timeTable = [
  {
    day: "Monday",
    table: [
      "Module1",
      "Module2",
      "Module3",
      "Module4",
      "Module5",
      "Module6",
      " ",
      " ",
      "",
    ],
  },
  {
    day: "Tuesday",
    table: ["Module1", "", "", "Module4", "Module5", "Module6", " ", " ", ""],
  },
  {
    day: "Wednesday",
    table: ["Module1", "", "", "Module4", "Module5", "Module6", " ", " ", ""],
  },
  {
    day: "Thursday",
    table: ["Module1", "", "", "Module4", "Module5", "Module6", " ", " ", ""],
  },
  {
    day: "Friday",
    table: ["Module1", "", "", "Module4", "Module5", "Module6", " ", " ", ""],
  },
];

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

const createTimeTable = () => {
  timeTable.forEach((tTable) => {
    const column = document.createElement("table");
    column.classList.add("table-column");
    //column.style = "display: flex; flex-direction: column;";
    column.innerHTML = `
        <thead>
          <tr class="column-header">
            <th>
              ${tTable.day} 
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="column-data" >

              <td>${tTable.table[0]}</td>
              <td>${tTable.table[1]}</td>
              <td>${tTable.table[2]}</td>
              <td>${tTable.table[3]}</td>
              <td>${tTable.table[4]}</td>
              <td>${tTable.table[5]}</td>
              <td>${tTable.table[6]}</td>
              <td>${tTable.table[7]}</td>
              <td>${tTable.table[8]}</td>
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

logOutBtn.addEventListener("click", () => {
  signOutStudent();
});

createTimeTable();
setInterval(() => {
  updateDateAndTime();
}, 1000);
