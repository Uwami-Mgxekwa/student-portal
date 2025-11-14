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
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // If search is empty, show all cards
    if (!searchTerm) {
      const resourceCards = document.querySelectorAll(".resource-card");
      resourceCards.forEach((card) => {
        card.style.display = "flex";
      });
      removeNoResultsMessage();
      return;
    }

    // Search across ALL tabs
    const resourceCards = document.querySelectorAll(".resource-card");
    let visibleCount = 0;

    resourceCards.forEach((card) => {
      const title = card.querySelector("h4").textContent.toLowerCase();
      const description = card.querySelector("p").textContent.toLowerCase();
      const meta = card.querySelector(".resource-meta")?.textContent.toLowerCase() || "";

      if (title.includes(searchTerm) || description.includes(searchTerm) || meta.includes(searchTerm)) {
        card.style.display = "flex";
        card.classList.add("search-result");
        visibleCount++;
      } else {
        card.style.display = "none";
        card.classList.remove("search-result");
      }
    });

    // Show "no results" message if nothing found
    if (visibleCount === 0) {
      showNoResultsMessage(searchTerm);
    } else {
      removeNoResultsMessage();
    }

    // Highlight search term
    highlightSearchTerm(searchTerm);
  }

  function showNoResultsMessage(searchTerm) {
    removeNoResultsMessage();
    
    const activePanel = document.querySelector(".tab-panel.active");
    const noResultsDiv = document.createElement("div");
    noResultsDiv.className = "no-results-message";
    noResultsDiv.innerHTML = `
      <i class="fas fa-search"></i>
      <h3>No results found</h3>
      <p>No resources match "${searchTerm}"</p>
      <button class="btn" onclick="document.getElementById('resource-search').value = ''; document.querySelector('#search-btn').click();">Clear Search</button>
    `;
    
    activePanel.insertBefore(noResultsDiv, activePanel.firstChild);
  }

  function removeNoResultsMessage() {
    const noResultsMsg = document.querySelector(".no-results-message");
    if (noResultsMsg) {
      noResultsMsg.remove();
    }
  }

  function highlightSearchTerm(term) {
    // Remove previous highlights
    document.querySelectorAll(".search-highlight").forEach(el => {
      el.classList.remove("search-highlight");
    });

    if (!term) return;

    // Add highlight to matching cards
    document.querySelectorAll(".resource-card.search-result h4").forEach(title => {
      if (title.textContent.toLowerCase().includes(term)) {
        title.classList.add("search-highlight");
      }
    });
  }

  function clearSearch() {
    searchInput.value = "";
    performSearch();
  }

  searchButton.addEventListener("click", performSearch);
  
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  // Real-time search as user types
  searchInput.addEventListener("input", () => {
    if (searchInput.value.length === 0) {
      clearSearch();
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

  console.log('🔍 [Resources] Loading recent files...');

  try {
    // Get student info to filter by year
    const studentResult = await getStudentInfo();
    console.log('👤 [Resources] Student info:', studentResult);

    if (!studentResult.success) {
      console.log('❌ [Resources] Student info failed');
      timeline.innerHTML = '<div class="timeline-error">Please log in to view files</div>';
      return;
    }

    const studentYear = studentResult.studentInfo?.year;
    console.log('📚 [Resources] Student year:', studentYear);
    
    if (!studentYear) {
      console.log('⚠️ [Resources] Student has no year assigned');
      timeline.innerHTML = '<div class="timeline-error">Your year is not set. Please contact admin.</div>';
      return;
    }

    // Fetch recent files from Supabase
    console.log('🔎 [Resources] Fetching files with query: year =', studentYear, 'or year = all');
    const { data: files, error } = await supabase
      .from('resources')
      .select('*')
      .eq('is_active', true)
      .or(`year.eq.${studentYear},year.eq.all`)
      .order('created_at', { ascending: false })
      .limit(10);

    console.log('📦 [Resources] Files received:', files);
    console.log('❗ [Resources] Error:', error);

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
  if (!loggedIn) {
    location.href = "../index.html";
  }
});
