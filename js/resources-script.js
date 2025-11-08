import { isLoggedIn, getStudentInfo } from "../lib/supabase-auth.js";
import { showSignOutModal } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";
import { supabase } from "../config/supabase.js";

const logOutBtn = document.getElementById("sign-out");

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));

      button.classList.add("active");
      const tabId = button.getAttribute("data-tab");
      document.getElementById(`${tabId}-panel`).classList.add("active");
    });
  });

  const searchInput = document.getElementById("resource-search");
  const searchButton = document.getElementById("search-btn");

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const resourceCards = document.querySelectorAll(".resource-card");

    resourceCards.forEach((card) => {
      const title = card.querySelector("h4").textContent.toLowerCase();
      const description = card.querySelector("p").textContent.toLowerCase();

      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  searchButton.addEventListener("click", performSearch);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  const categoryFilter = document.getElementById("resource-category");
  categoryFilter.addEventListener("change", filterResources);

  const departmentFilter = document.getElementById("resource-department");
  departmentFilter.addEventListener("change", filterResources);

  function filterResources() {
    const categoryValue = categoryFilter.value;
    const departmentValue = departmentFilter.value;

    tabPanels.forEach((panel) => panel.classList.add("active"));

    if (categoryValue !== "all") {
      document.querySelector(`.tab-btn[data-tab="${categoryValue}"]`).click();
    }

    const resourceCards = document.querySelectorAll(".resource-card");
    resourceCards.forEach((card) => {
      const cardDepartment = card.getAttribute("data-department") || "all";

      if (departmentValue === "all" || cardDepartment === departmentValue) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  function adjustTimelineDates() {
    const timelineSection = document.querySelector(".timeline");
    const timelineItems = document.querySelectorAll(".timeline-item");
    const windowWidth = window.innerWidth;

    if (windowWidth <= 768) {
      timelineSection.style.paddingLeft = "3rem";

      timelineItems.forEach((item) => {
        const dateElement = item.querySelector(".timeline-date");
        dateElement.style.position = "static";
        dateElement.style.width = "auto";
        dateElement.style.textAlign = "left";
        dateElement.style.marginBottom = "0.5rem";
        dateElement.style.fontWeight = "bold";
      });
    } else {
      timelineSection.style.paddingLeft = "8rem";

      timelineItems.forEach((item) => {
        const dateElement = item.querySelector(".timeline-date");
        dateElement.style.position = "absolute";
        dateElement.style.left = "-6rem";
        dateElement.style.width = "5rem";
        dateElement.style.textAlign = "right";
        dateElement.style.marginBottom = "0";
      });
    }
  }

  window.addEventListener("DOMContentLoaded", adjustTimelineDates);

  adjustTimelineDates();

  window.addEventListener("resize", adjustTimelineDates);

  function loadTabContent(tabId) {
    const panel = document.getElementById(`${tabId}-panel`);

    if (panel.querySelector(".resource-message")) {
      setTimeout(() => {
        panel.innerHTML = `
                    <div class="resource-cards">
                        <div class="resource-card">
                            <div class="resource-details">
                                <div class="resource-icon ${tabId === "policies" ? "policy-icon" : "form-icon"}"></div>
                                <div>
                                    <h4>${tabId.charAt(0).toUpperCase() + tabId.slice(1)} Resource 1</h4>
                                    <p>Description for ${tabId} resource 1</p>
                                    <span class="resource-meta">PDF • 0.5 MB • Updated Feb 12, 2025</span>
                                </div>
                            </div>
                            <a href="#" class="btn resource-btn">Download</a>
                        </div>
                        <div class="resource-card">
                            <div class="resource-details">
                                <div class="resource-icon ${tabId === "policies" ? "policy-icon" : "form-icon"}"></div>
                                <div>
                                    <h4>${tabId.charAt(0).toUpperCase() + tabId.slice(1)} Resource 2</h4>
                                    <p>Description for ${tabId} resource 2</p>
                                    <span class="resource-meta">PDF • 0.7 MB • Updated Jan 25, 2025</span>
                                </div>
                            </div>
                            <a href="#" class="btn resource-btn">Download</a>
                        </div>
                    </div>
                `;
      }, 1000);
    }
  }

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      loadTabContent(tabId);
    });
  });
  
  // Load recent files from Supabase
  loadRecentFiles();
});

async function loadRecentFiles() {
  const timeline = document.getElementById("recentFilesTimeline");
  
  try {
    // Get student info to filter by year
    const studentResult = await getStudentInfo();
    if (!studentResult.success) {
      timeline.innerHTML = '<div class="timeline-error">Please log in to view files</div>';
      return;
    }
    
    const studentYear = studentResult.student.year;
    
    // Fetch recent files from Supabase
    const { data: files, error } = await supabase
      .from('resources')
      .select('*')
      .eq('is_active', true)
      .or(`year.eq.${studentYear},year.eq.all`)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    if (!files || files.length === 0) {
      timeline.innerHTML = '<div class="timeline-empty">No files available yet. Check back soon!</div>';
      return;
    }
    
    // Render files in timeline
    timeline.innerHTML = '';
    files.forEach((file) => {
      const uploadDate = new Date(file.created_at);
      const formattedDate = uploadDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      const fileSize = formatFileSize(file.file_size);
      
      const timelineItem = document.createElement('div');
      timelineItem.className = 'timeline-item';
      
      timelineItem.innerHTML = `
        <div class="timeline-date">${formattedDate}</div>
        <div class="timeline-content">
          <h4>${file.title}</h4>
          <p>${file.description || `${file.category} resource for Year ${file.year === 'all' ? 'All' : file.year}`}</p>
          <div class="timeline-meta">
            <span class="file-category-badge">${file.category}</span>
            <span class="file-size-badge">${fileSize}</span>
          </div>
          <a href="${file.file_url}" target="_blank" class="btn resource-btn-small">
            <i class="fas fa-download"></i> Download
          </a>
        </div>
      `;
      
      timeline.appendChild(timelineItem);
    });
    
  } catch (error) {
    console.error('Error loading recent files:', error);
    timeline.innerHTML = '<div class="timeline-error">Failed to load recent files</div>';
  }
}

function formatFileSize(bytes) {
  if (!bytes) return 'Unknown';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

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
