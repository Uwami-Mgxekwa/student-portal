import { isLoggedIn, getStudentInfo } from "../lib/supabase-auth.js";
import { setTheme } from "../lib/theme.js";
import { showSignOutModal } from "../lib/pop-up.js";

const logOutBtn = document.getElementById("sign-out");
const greeting = document.getElementById("greeting");
const profileImg = document.getElementById("profile-img");

document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();
  renderEvents();
  initializeEventFilters();
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

function renderEvents() {
  const events = [
    {
      title: "Career Fair 2025",
      date: { month: "Mar", day: "15" },
      time: "10:00 AM - 4:00 PM",
      location: "Main Campus",
      description:
        "Connect with top employers from various industries and explore career opportunities.",
      type: "academic",
      attendees: 120,
    },
    {
      title: "Web Development Workshop",
      date: { month: "Mar", day: "22" },
      time: "2:00 PM - 5:00 PM",
      location: "Computer Lab 3",
      description:
        "Learn modern web development techniques with hands-on exercises.",
      type: "workshop",
      attendees: 45,
    },
    {
      title: "Campus Spring Festival",
      date: { month: "Mar", day: "29" },
      time: "12:00 PM - 8:00 PM",
      location: "Campus Grounds",
      description:
        "Join us for food, music, games, and entertainment to celebrate the season.",
      type: "social",
      attendees: 350,
    },
    {
      title: "AI Research Symposium",
      date: { month: "Apr", day: "05" },
      time: "9:00 AM - 3:00 PM",
      location: "Conference Hall",
      description:
        "Presentations on the latest research in artificial intelligence and machine learning.",
      type: "academic",
      attendees: 85,
    },
    {
      title: "Photography Masterclass",
      date: { month: "Apr", day: "12" },
      time: "1:00 PM - 4:00 PM",
      location: "Media Studio",
      description:
        "Learn professional photography techniques with industry experts.",
      type: "workshop",
      attendees: 30,
    },
  ];

  renderEventsList(events);
}

function renderEventsList(events) {
  const eventsList = document.getElementById("eventsList");
  eventsList.innerHTML = "";

  events.forEach((event) => {
    const card = document.createElement("div");
    card.className = `event-card ${event.type}`;
    card.setAttribute("data-type", event.type);

    card.innerHTML = `
      <div class="event-date">
        <span class="event-month">${event.date.month}</span>
        <span class="event-day">${event.date.day}</span>
      </div>
      <div class="event-details">
        <h3>${event.title}</h3>
        <div class="event-meta">
          <span><i class="fas fa-clock"></i> ${event.time}</span>
          <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
          <span><i class="fas fa-users"></i> ${event.attendees} attending</span>
        </div>
        <p class="event-description">${event.description}</p>
        <div class="event-footer">
          <span class="event-badge ${event.type}">${
            event.type.charAt(0).toUpperCase() + event.type.slice(1)
          }</span>
          <div class="event-actions">
            <button class="event-action-btn">Add to Calendar</button>
            <button class="event-action-btn primary">Register</button>
          </div>
        </div>
      </div>
    `;

    eventsList.appendChild(card);
  });
}

function initializeEventFilters() {
  const filterOptions = document.querySelectorAll(".filter-option");
  const eventCards = document.querySelectorAll(".event-card");

  filterOptions.forEach((option) => {
    option.addEventListener("click", () => {
      filterOptions.forEach((opt) => opt.classList.remove("active"));
      option.classList.add("active");

      const filterValue = option.getAttribute("data-filter");

      eventCards.forEach((card) => {
        if (
          filterValue === "all" ||
          card.getAttribute("data-type") === filterValue
        ) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

const showGreeting = async () => {
  const result = await getStudentInfo();
  if (result.success) {
    const { student } = result;
    greeting.innerText =
      "Hi, " +
      student.first_name.toUpperCase() +
      " " +
      student.last_name.toUpperCase();
    profileImg.src = student.profile_image || "../assets/fallback-icon.png";
  } else {
    localStorage.clear();
    location.href = "../index.html";
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
    await showGreeting();
  } else {
    location.href = "../index.html";
  }
});
