import { isLoggedIn, getStudentInfo } from "../lib/supabase-auth.js";
import { setTheme } from "../lib/theme.js";
import { showSignOutModal } from "../lib/pop-up.js";
import { supabase } from "../config/supabase.js";

const logOutBtn = document.getElementById("sign-out");
const greeting = document.getElementById("greeting");
const profileImg = document.getElementById("profile-img");

document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();
  renderCalendar();
  loadRecentFiles();
  renderTrendingCourses();
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

function renderCalendar() {
  const calendar = document.getElementById("calendar");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  calendar.innerHTML = "";
  const monthName = document.getElementById("month-name");
  monthName.innerText = months[new Date().getMonth()];

  days.forEach((day) => {
    const dayElement = document.createElement("div");
    dayElement.textContent = day;
    dayElement.style.fontWeight = "bold";
    calendar.appendChild(dayElement);
  });

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const tests = [10, 11, 12];
  const exams = [24, 26, 27];

  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.style.background = "var(--background)";
    calendar.appendChild(emptyDay);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = document.createElement("div");
    let pinElement = document.createElement("span");
    dayElement.textContent = i;
    if (i === currentDate.getDate()) {
      dayElement.style.background = "var(--background)";
      dayElement.style.fontWeight = "bold";
      dayElement.style.border = "1px solid var(--primary)";
    }

    if (tests.includes(i)) {
      pinElement.style.background = "#00ff00";
      dayElement.appendChild(pinElement);
    }

    if (exams.includes(i)) {
      pinElement.style.background = "#ff0000";
      dayElement.appendChild(pinElement);
    }

    calendar.appendChild(dayElement);
  }
}

async function loadRecentFiles() {
  const filesList = document.getElementById("recentFilesList");
  const filesUpdateInfo = document.getElementById("filesUpdateInfo");
  
  console.log('🔍 Loading recent files...');
  
  try {
    // Get student info to filter by year
    const studentResult = await getStudentInfo();
    console.log('👤 Student info:', studentResult);
    
    if (!studentResult.success) {
      console.log('❌ Student info failed');
      filesList.innerHTML = '<div class="no-files">Please log in to view files</div>';
      return;
    }
    
    const studentYear = studentResult.studentInfo?.year;
    console.log('📚 Student year:', studentYear);
    
    if (!studentYear) {
      console.log('⚠️ Student has no year assigned');
      filesList.innerHTML = '<div class="no-files">Your year is not set. Please contact admin.</div>';
      filesUpdateInfo.textContent = 'Year not set';
      return;
    }
    
    // Fetch recent files from Supabase
    console.log('🔎 Fetching files with query: year =', studentYear, 'or year = all');
    const { data: files, error } = await supabase
      .from('resources')
      .select('*')
      .eq('is_active', true)
      .or(`year.eq.${studentYear},year.eq.all`)
      .order('created_at', { ascending: false })
      .limit(5);
    
    console.log('📦 Files received:', files);
    console.log('❗ Error:', error);
    
    if (error) throw error;
    
    if (!files || files.length === 0) {
      filesList.innerHTML = '<div class="no-files">No files available yet</div>';
      filesUpdateInfo.textContent = 'No files uploaded';
      return;
    }
    
    // Update info text
    const latestDate = new Date(files[0].created_at);
    filesUpdateInfo.textContent = `${files.length} files • Last updated ${latestDate.toLocaleDateString()}`;
    
    // Render files
    filesList.innerHTML = '';
    files.forEach((file) => {
      const card = document.createElement("div");
      card.className = "assignment-card file-card";
      
      const fileSize = formatFileSize(file.file_size);
      const uploadDate = new Date(file.created_at).toLocaleDateString();
      
      card.innerHTML = `
        <div class="assignment-info">
          <div class="assignment-icon file-icon">
            <i class="fas fa-file-pdf"></i>
          </div>
          <div class="assignment-details">
            <h3>${file.title}</h3>
            <p>${file.category} • Year ${file.year === 'all' ? 'All' : file.year}</p>
          </div>
        </div>
        <div class="assignment-meta">
          <span>${fileSize} • ${uploadDate}</span>
          <a href="${file.file_url}" target="_blank" class="download-btn" title="Download">
            <i class="fas fa-download"></i>
          </a>
        </div>
      `;
      
      filesList.appendChild(card);
    });
    
  } catch (error) {
    console.error('Error loading files:', error);
    filesList.innerHTML = '<div class="error-files">Failed to load files</div>';
    filesUpdateInfo.textContent = 'Error loading files';
  }
}

function formatFileSize(bytes) {
  if (!bytes) return 'Unknown';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function renderTrendingCourses() {
  const courses = [
    {
      title: "Data Science Fundamentals",
      instructor: "Dr. J. Smith",
      students: 453,
    },
    {
      title: "Mobile App Development",
      instructor: "Prof. T. Johnson",
      students: 328,
    },
  ];

  const coursesList = document.getElementById("coursesList");
  if (coursesList) {
    coursesList.innerHTML = "";

    courses.forEach((course) => {
      const card = document.createElement("div");
      card.className = "course-card";

      card.innerHTML = `
<div class="course-card-header">
  <div class="course-info">
    <h4>${course.title}</h4>
    <p>${course.instructor}</p>
  </div>
  <span class="course-badge">${course.students} students</span>
</div>
`;

      coursesList.appendChild(card);
    });
  }
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

window.addEventListener("load", async () => {
  let currTheme = localStorage.getItem("theme");
  if (!currTheme) {
    currTheme = "light";
  }
  setTheme(currTheme);
  
  const loggedIn = await isLoggedIn();
  if (loggedIn) {
    showGreeting();
  } else {
    location.href = "../index.html";
  }
});
