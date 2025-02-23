import { removeLoading, showLoading } from "../lib/loading.js";
import postData from "../lib/post-data.js";
const tableContainer = document.getElementById("table-container");
const logOutBtn = document.getElementById("sign-out");
const signOutUrl = "https://sp-server-ts.onrender.com/api/logout";

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

document
  .querySelector(".nav-item.dashboard")
  .addEventListener("click", function () {
    window.location.href = "../pages/dashboard.html";
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

function signOutStudent() {
  showLoading("Signing out");
  const jsonValue = localStorage.getItem("stu");

  const onSuccess = () => {
    removeLoading();
    localStorage.clear();
    location.href = "../index.html";
  };

  const onFail = (message) => {
    let title = "Sign out error";
    removeLoading();
    showAlert(title, message);
    localStorage.clear();
    location.href = "../index.html";
  };

  if (jsonValue) {
    try {
      const studentDetails = JSON.parse(jsonValue);
      postData(signOutUrl, { id: studentDetails._id }, onSuccess, onFail);
    } catch (e) {
      console.error("Error parsing student data:", e);
      showAlert("Session error", e.message);
    }
  } else {
    showAlert("Session error", "Session failed to sign out");
    console.log("Failed to sign out");
  }
}

logOutBtn.addEventListener("click", () => {
  signOutStudent();
});

createTimeTable();
