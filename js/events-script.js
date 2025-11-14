import { isLoggedIn, getStudentInfo } from "../lib/supabase-auth.js";
import { setTheme } from "../lib/theme.js";
import { showSignOutModal } from "../lib/pop-up.js";
import { supabase } from "../config/supabase.js";

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

async function renderEvents() {
  const eventsList = document.getElementById("eventsList");
  eventsList.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text);"><i class="fas fa-spinner fa-spin" style="font-size: 32px;"></i><p>Loading events...</p></div>';

  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) throw error;

    if (!events || events.length === 0) {
      eventsList.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text);">
          <i class="fas fa-calendar-times" style="font-size: 60px; opacity: 0.3; margin-bottom: 20px;"></i>
          <h3>No Events Available</h3>
          <p>Check back later for upcoming events and activities.</p>
        </div>
      `;
      return;
    }

    // Transform database events to match the expected format
    const formattedEvents = events.map(event => {
      const eventDate = new Date(event.event_date);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      return {
        title: event.title,
        date: {
          month: months[eventDate.getMonth()],
          day: eventDate.getDate().toString()
        },
        time: event.event_time || 'TBA',
        location: event.location || 'TBA',
        description: event.description || 'No description available',
        type: event.event_type || 'general',
        attendees: event.expected_attendees || 0
      };
    });

    renderEventsList(formattedEvents);

  } catch (error) {
    console.error('Error loading events:', error);
    eventsList.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: var(--text);">
        <i class="fas fa-exclamation-triangle" style="font-size: 60px; color: #ef4444; margin-bottom: 20px;"></i>
        <h3>Error Loading Events</h3>
        <p>Unable to load events. Please try again later.</p>
      </div>
    `;
  }
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
