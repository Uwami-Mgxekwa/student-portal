import { isLoggedIn, getStudentInfo } from "../lib/supabase-auth.js";
import { setTheme } from "../lib/theme.js";
import { showSignOutModal } from "../lib/pop-up.js";
import { supabase } from "../config/supabase.js";
import { loadNotificationCount } from "../lib/notifications.js";

const logOutBtn = document.getElementById("sign-out");
const greeting = document.getElementById("greeting");
const profileImg = document.getElementById("profile-img");

document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();
  renderCalendar();
  loadRecentFiles();
  renderPendingAssignments();
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

async function renderCalendar() {
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
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  monthName.innerText = months[currentMonth];

  days.forEach((day) => {
    const dayElement = document.createElement("div");
    dayElement.textContent = day;
    dayElement.style.fontWeight = "bold";
    calendar.appendChild(dayElement);
  });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // Fetch important dates from database
  let importantDates = { tests: [], exams: [], deadlines: [], holidays: [] };
  try {
    const studentResult = await getStudentInfo(false); // Don't show loading overlay
    const studentYear = studentResult.success && studentResult.studentInfo ? studentResult.studentInfo.year : null;

    // Format dates for SQL query
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const startOfMonth = `${currentYear}-${monthStr}-01`;
    const endOfMonth = `${currentYear}-${monthStr}-${daysInMonth}`;

    const { data: dates, error } = await supabase
      .from('important_dates')
      .select('*')
      .gte('start_date', startOfMonth)
      .lte('start_date', endOfMonth);

    if (!error && dates) {
      dates.forEach(date => {
        // Check if date applies to this student's year
        if (date.target_year === 'all' || date.target_year === String(studentYear)) {
          const startDate = new Date(date.start_date);
          const day = startDate.getDate();
          
          // Add the start day
          if (date.date_type === 'test') importantDates.tests.push(day);
          else if (date.date_type === 'exam') importantDates.exams.push(day);
          else if (date.date_type === 'deadline') importantDates.deadlines.push(day);
          else if (date.date_type === 'holiday') importantDates.holidays.push(day);
          
          // Handle date ranges (if end_date exists)
          if (date.end_date) {
            const endDate = new Date(date.end_date);
            const endDay = endDate.getDate();
            const endMonth = endDate.getMonth();
            
            // Only add range if end date is in the same month
            if (endMonth === currentMonth) {
              for (let d = day + 1; d <= endDay; d++) {
                if (date.date_type === 'test') importantDates.tests.push(d);
                else if (date.date_type === 'exam') importantDates.exams.push(d);
                else if (date.date_type === 'deadline') importantDates.deadlines.push(d);
                else if (date.date_type === 'holiday') importantDates.holidays.push(d);
              }
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Error loading important dates:', error);
  }

  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.style.background = "var(--background)";
    calendar.appendChild(emptyDay);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = document.createElement("div");
    dayElement.textContent = i;
    
    if (i === currentDate.getDate()) {
      dayElement.style.background = "var(--background)";
      dayElement.style.fontWeight = "bold";
      dayElement.style.border = "1px solid var(--primary)";
    }

    // Add markers for important dates
    if (importantDates.tests.includes(i)) {
      const pinElement = document.createElement("span");
      pinElement.style.background = "#10b981";
      pinElement.title = "Test";
      dayElement.appendChild(pinElement);
    }

    if (importantDates.exams.includes(i)) {
      const pinElement = document.createElement("span");
      pinElement.style.background = "#ef4444";
      pinElement.title = "Exam";
      dayElement.appendChild(pinElement);
    }

    if (importantDates.deadlines.includes(i)) {
      const pinElement = document.createElement("span");
      pinElement.style.background = "#f59e0b";
      pinElement.title = "Deadline";
      dayElement.appendChild(pinElement);
    }

    if (importantDates.holidays.includes(i)) {
      const pinElement = document.createElement("span");
      pinElement.style.background = "#3b82f6";
      pinElement.title = "Holiday";
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
    const studentResult = await getStudentInfo(false); // Don't show loading overlay
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

async function renderPendingAssignments() {
  const assignmentsList = document.getElementById("pendingAssignmentsList");
  if (!assignmentsList) return;

  assignmentsList.innerHTML = '<div class="loading-assignments">Loading...</div>';

  try {
    // Get student info to filter by year
    const studentResult = await getStudentInfo(false); // Don't show loading overlay
    const studentYear = studentResult.success && studentResult.studentInfo ? studentResult.studentInfo.year : null;

    // Fetch assignments from database
    const { data: pendingAssignments, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('is_active', true)
      .gte('due_date', new Date().toISOString().split('T')[0])
      .order('due_date', { ascending: true });

    if (error) throw error;

    // Filter by student year
    const filteredAssignments = pendingAssignments?.filter(assignment => 
      assignment.target_year === 'all' || assignment.target_year === String(studentYear)
    ) || [];

    assignmentsList.innerHTML = "";

    if (filteredAssignments.length === 0) {
      assignmentsList.innerHTML = `
        <div class="no-assignments">
          <i class="fas fa-check-circle"></i>
          <p>All caught up!</p>
        </div>
      `;
      
      // Still add contact button
      const helpSection = document.createElement("div");
      helpSection.className = "help-section";
      helpSection.innerHTML = `
        <p class="help-text">Need help with assignments?</p>
        <button class="whatsapp-contact-btn" onclick="openWhatsAppContact()">
          <i class="fab fa-whatsapp"></i> Contact Support
        </button>
      `;
      assignmentsList.appendChild(helpSection);
      return;
    }

    const pendingAssignmentsFormatted = filteredAssignments.map(a => ({
      title: a.title,
      course: a.course,
      dueDate: a.due_date,
      priority: a.priority
    }));

    pendingAssignmentsFormatted.forEach((assignment) => {
    const card = document.createElement("div");
    card.className = "assignment-card-sidebar";

    const dueDate = new Date(assignment.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    let dueDateText = "";
    let dueDateClass = "";
    
    if (daysUntilDue < 0) {
      dueDateText = "Overdue";
      dueDateClass = "overdue";
    } else if (daysUntilDue === 0) {
      dueDateText = "Due today";
      dueDateClass = "due-today";
    } else if (daysUntilDue === 1) {
      dueDateText = "Due tomorrow";
      dueDateClass = "due-soon";
    } else if (daysUntilDue <= 3) {
      dueDateText = `Due in ${daysUntilDue} days`;
      dueDateClass = "due-soon";
    } else {
      dueDateText = dueDate.toLocaleDateString();
      dueDateClass = "due-later";
    }

    card.innerHTML = `
      <div class="assignment-header-sidebar">
        <div class="assignment-priority ${assignment.priority}"></div>
        <span class="due-date ${dueDateClass}">${dueDateText}</span>
      </div>
      <h4>${assignment.title}</h4>
      <p class="assignment-course">${assignment.course}</p>
    `;

      assignmentsList.appendChild(card);
    });

    // Add general contact button at the bottom
    const helpSection = document.createElement("div");
    helpSection.className = "help-section";
    helpSection.innerHTML = `
      <p class="help-text">Need help with assignments?</p>
      <button class="whatsapp-contact-btn" onclick="openWhatsAppContact()">
        <i class="fab fa-whatsapp"></i> Contact Support
      </button>
    `;
    assignmentsList.appendChild(helpSection);

  } catch (error) {
    console.error('Error loading assignments:', error);
    assignmentsList.innerHTML = `
      <div class="no-assignments">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load assignments</p>
      </div>
    `;
  }
}

// WhatsApp helper functions
function openWhatsAppHelp(assignmentTitle) {
  const phoneNumber = "27635722080"; // South African format (27 + your number without leading 0)
  const message = encodeURIComponent(`Hi! I need help with: ${assignmentTitle}`);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

function openWhatsAppContact() {
  const phoneNumber = "27635722080";
  const message = encodeURIComponent("Hi! I have a question about my courses.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

// Make functions globally available
window.openWhatsAppHelp = openWhatsAppHelp;
window.openWhatsAppContact = openWhatsAppContact;

const showGreeting = async () => {
  const result = await getStudentInfo(true); // Show loading overlay only here
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
    await showGreeting(); // Wait for greeting to complete
    loadNotificationCount(); // Load notification badge count
  } else {
    location.href = "../index.html";
  }
});
