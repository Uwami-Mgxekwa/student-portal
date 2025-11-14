import { isLoggedIn, getStudentInfo } from "../lib/supabase-auth.js";
import { showSignOutModal } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";
import { supabase } from "../config/supabase.js";

const logOutBtn = document.getElementById("sign-out");

document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();
  loadStudentCourses();
  setupEventListeners();
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

function setupEventListeners() {
  document
    .querySelector(".nav-item:not(.active)")
    .addEventListener("click", function () {
      window.location.href = "../pages/dashboard.html";
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
    .querySelector(".nav-item.events")
    .addEventListener("click", function (){
      window.location.href = "../pages/events.html";
    })

  document
    .querySelector(".nav-item.settings")
    .addEventListener("click", function () {
      window.location.href = "../pages/settings.html";
    });
}

// Calculate course progress based on academic year timeline
// Academic year: March - December (exams Dec 1-12)
function calculateCourseProgress() {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11 (0=Jan, 11=Dec)
  const currentDay = now.getDate();
  
  // Academic year starts in March (month 2) and ends in December (month 11)
  // Exams are Dec 1-12
  
  let progress = 0;
  
  if (currentMonth < 2) {
    // January-February: Between academic years (break)
    progress = 0;
  } else if (currentMonth === 2) {
    // March: Start of year (0-10%)
    progress = Math.floor((currentDay / 31) * 10);
  } else if (currentMonth === 3) {
    // April: (10-20%)
    progress = 10 + Math.floor((currentDay / 30) * 10);
  } else if (currentMonth === 4) {
    // May: (20-30%)
    progress = 20 + Math.floor((currentDay / 31) * 10);
  } else if (currentMonth === 5) {
    // June: (30-40%)
    progress = 30 + Math.floor((currentDay / 30) * 10);
  } else if (currentMonth === 6) {
    // July: (40-50%)
    progress = 40 + Math.floor((currentDay / 31) * 10);
  } else if (currentMonth === 7) {
    // August: (50-60%)
    progress = 50 + Math.floor((currentDay / 31) * 10);
  } else if (currentMonth === 8) {
    // September: (60-70%)
    progress = 60 + Math.floor((currentDay / 30) * 10);
  } else if (currentMonth === 9) {
    // October: (70-80%)
    progress = 70 + Math.floor((currentDay / 31) * 10);
  } else if (currentMonth === 10) {
    // November: (80-90%)
    progress = 80 + Math.floor((currentDay / 30) * 10);
  } else if (currentMonth === 11) {
    // December: Final exams (90-100%)
    if (currentDay <= 12) {
      // During exams (Dec 1-12)
      progress = 90 + Math.floor((currentDay / 12) * 10);
    } else {
      // After exams - year complete
      progress = 100;
    }
  }
  
  return Math.min(progress, 100);
}

// Fetch courses from database
async function fetchCoursesFromDatabase(studentYear) {
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('course_name');

    if (error) throw error;

    if (!courses || courses.length === 0) {
      return [];
    }

    // Filter courses that are available for this year
    const availableCourses = courses.filter(course => {
      const years = (course.available_years || '1,2,3').split(',');
      return years.includes(studentYear.toString());
    });

    // Transform database courses to match the expected format
    return availableCourses.map((course, index) => ({
      id: course.id,
      code: course.course_code || 'N/A',
      title: course.course_name,
      instructor: 'TBA', // Can be added to database later
      progress: calculateCourseProgress(),
      image: '../assets/programming.jpg', // Default image
      assignments: Math.floor(Math.random() * 5) + 1, // Placeholder
      tests: Math.floor(Math.random() * 3) + 1, // Placeholder
      averageMark: Math.floor(Math.random() * 30) + 60, // Placeholder
      description: course.description,
      certificate: course.certificate_type,
      duration: course.duration
    }));

  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

async function loadStudentCourses() {
  const enrolledCoursesContainer = document.getElementById("enrolledCourses");
  
  // Show skeleton loaders while loading
  const { createSkeletonLoader } = await import("../lib/loading.js");
  enrolledCoursesContainer.innerHTML = "";
  enrolledCoursesContainer.appendChild(createSkeletonLoader("card", 2));
  
  try {
    // Get student info to determine year
    const studentResult = await getStudentInfo();
    
    if (!studentResult.success || !studentResult.studentInfo) {
      enrolledCoursesContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text);">
          <i class="fas fa-exclamation-circle" style="font-size: 48px; opacity: 0.3; margin-bottom: 10px;"></i>
          <p>Unable to load your courses. Please contact support.</p>
        </div>
      `;
      return;
    }
    
    const studentYear = studentResult.studentInfo.year;
    console.log('Student Year:', studentYear);
    
    // Get courses for this year from database
    const enrolledCourses = await fetchCoursesFromDatabase(studentYear);
    
    if (enrolledCourses.length === 0) {
      enrolledCoursesContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text);">
          <i class="fas fa-book-open" style="font-size: 48px; opacity: 0.3; margin-bottom: 10px;"></i>
          <p>No courses available for Year ${studentYear} yet.</p>
        </div>
      `;
      return;
    }
    
    // Render courses with fade-in animation
    enrolledCoursesContainer.innerHTML = "";
    enrolledCourses.forEach((course, index) => {
      const card = createCourseCard(course);
      card.style.opacity = "0";
      enrolledCoursesContainer.appendChild(card);
      
      // Stagger animation
      setTimeout(() => {
        card.classList.add("fade-in");
        card.style.opacity = "1";
      }, index * 100);
    });
    
    // Update deadlines based on year
    renderDeadlines(studentYear);
    
  } catch (error) {
    console.error('Error loading courses:', error);
    enrolledCoursesContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text);">
        <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ef4444; margin-bottom: 10px;"></i>
        <p>Error loading courses. Please try again.</p>
      </div>
    `;
  }
}

function createCourseCard(course) {
  const card = document.createElement("div");
  card.className = "course-card";

  const imagePath = course.image || "../assets/logo.png";

  card.innerHTML = `
    <div class="course-image">
      <img src="${imagePath}" alt="${course.title}" onerror="this.src='../assets/logo.png'">
      <div class="course-code">${course.code}</div>
    </div>
    <div class="course-content">
      <div class="course-title">${course.title}</div>
      <div class="course-instructor"><i class="fas fa-user"></i> ${course.instructor}</div>
      
      <div class="course-progress">
        <div class="progress-info">
          <span>Course Progress</span>
          <span>${course.progress || 0}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-value" style="width: ${course.progress || 0}%"></div>
        </div>
      </div>

      <div class="course-stats">
        <div class="stat-item">
          <i class="fas fa-tasks"></i>
          <span>${course.assignments} Assignments</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-file-alt"></i>
          <span>${course.tests} Tests</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-chart-line"></i>
          <span>Avg: ${course.averageMark}%</span>
        </div>
      </div>

      <button class="course-action-btn" onclick="viewCourseDetails('${course.code}', '${course.title}')">
        <i class="fas fa-eye"></i> View Details
      </button>
    </div>
  `;

  return card;
}

function renderDeadlines(studentYear) {
  const deadlinesByYear = {
    "1": [
      {
        title: "Programming Assignment 2",
        course: "Introduction to Programming",
        date: "Nov 20, 2025",
      },
      {
        title: "Database Design Project",
        course: "Database Management Systems",
        date: "Nov 25, 2025",
      },
      {
        title: "Test 2 - Programming",
        course: "Introduction to Programming",
        date: "Dec 2, 2025",
      },
    ],
    "2": [
      {
        title: "Advanced Programming Project",
        course: "Advanced Programming II",
        date: "Nov 22, 2025",
      },
      {
        title: "Web Development Assignment 3",
        course: "Web Development",
        date: "Nov 28, 2025",
      },
      {
        title: "Test 2 - Web Development",
        course: "Web Development",
        date: "Dec 5, 2025",
      },
    ],
  };

  const deadlines = deadlinesByYear[studentYear] || [];
  const deadlinesList = document.getElementById("deadlinesList");
  if (!deadlinesList) return;

  deadlinesList.innerHTML = "";

  if (deadlines.length === 0) {
    deadlinesList.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text); opacity: 0.6;">
        <p>No upcoming deadlines</p>
      </div>
    `;
    return;
  }

  deadlines.forEach((deadline) => {
    const deadlineItem = document.createElement("div");
    deadlineItem.className = "deadline-item";

    deadlineItem.innerHTML = `
      <div class="deadline-date">${deadline.date}</div>
      <div class="deadline-title">${deadline.title}</div>
      <div class="deadline-course">${deadline.course}</div>
    `;

    deadlinesList.appendChild(deadlineItem);
  });
}

// Function to navigate to course details
window.viewCourseDetails = function(courseCode, courseTitle) {
  window.location.href = `../pages/course-details.html?code=${courseCode}&title=${encodeURIComponent(courseTitle)}`;
}

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
  if (!loggedIn) {
    location.href = "../index.html";
  }
});
