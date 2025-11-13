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
      title: "Freshers",
      date: { month: "Feb", day: "10" },
      time: "9:00 AM - 5:00 PM",
      location: "Main Campus",
      description:
        "Welcome event for new students to meet peers, explore campus, and learn about college life.",
      type: "social",
      attendees: 250,
    },
    {
      title: "MR and MRS GCC",
      date: { month: "Mar", day: "15" },
      time: "6:00 PM - 10:00 PM",
      location: "College Auditorium",
      description:
        "Annual pageant competition celebrating talent, personality, and school spirit.",
      type: "social",
      attendees: 180,
    },
    {
      title: "Sports Day",
      date: { month: "Apr", day: "22" },
      time: "8:00 AM - 4:00 PM",
      location: "Sports Complex",
      description:
        "Inter-campus sports competition featuring various athletic events and team games.",
      type: "social",
      attendees: 320,
    },
    {
      title: "Exam Workshops",
      date: { month: "May", day: "05" },
      time: "10:00 AM - 3:00 PM",
      location: "Lecture Hall A",
      description:
        "Comprehensive exam preparation workshops covering study techniques and time management.",
      type: "academic",
      attendees: 150,
    },
    {
      title: "Student Exam Workshops",
      date: { month: "May", day: "12" },
      time: "2:00 PM - 5:00 PM",
      location: "Computer Lab 2",
      description:
        "Student-led peer tutoring sessions and exam revision workshops.",
      type: "workshop",
      attendees: 85,
    },
    {
      title: "Heritage Day",
      date: { month: "Sep", day: "24" },
      time: "10:00 AM - 6:00 PM",
      location: "Campus Grounds",
      description:
        "Celebrate South African culture with traditional food, music, dance, and cultural exhibitions.",
      type: "social",
      attendees: 400,
    },
    {
      title: "GBV Awareness Day",
      date: { month: "Nov", day: "25" },
      time: "9:00 AM - 2:00 PM",
      location: "Conference Hall",
      description:
        "Educational event raising awareness about gender-based violence with guest speakers and support resources.",
      type: "academic",
      attendees: 200,
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
            <button class="event-action-btn primary add-to-calendar" data-event='${JSON.stringify(event)}'>
              <i class="fas fa-calendar-plus"></i> Add to Calendar
            </button>
          </div>
        </div>
      </div>
    `;

    eventsList.appendChild(card);
  });

  // Add event listeners for Add to Calendar buttons
  document.querySelectorAll('.add-to-calendar').forEach(button => {
    button.addEventListener('click', (e) => {
      const eventData = JSON.parse(e.currentTarget.getAttribute('data-event'));
      addToCalendar(eventData);
    });
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

function addToCalendar(event) {
  // Parse the date and time
  const monthMap = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const year = 2025; // Current year for events
  const month = monthMap[event.date.month];
  const day = parseInt(event.date.day);
  
  // Parse start time (e.g., "10:00 AM - 4:00 PM")
  const timeRange = event.time.split(' - ');
  const startTime = parseTime(timeRange[0]);
  const endTime = parseTime(timeRange[1]);
  
  const startDate = new Date(year, month, day, startTime.hours, startTime.minutes);
  const endDate = new Date(year, month, day, endTime.hours, endTime.minutes);
  
  // Format dates for iCalendar (YYYYMMDDTHHMMSS)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}00`;
  };
  
  // Create iCalendar content
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gauteng City College//Events//EN',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  // Create and download the .ics file
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

function parseTime(timeStr) {
  const [time, period] = timeStr.trim().split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return { hours, minutes };
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
