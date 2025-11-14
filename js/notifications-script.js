import { isLoggedIn, getStudentInfo } from "../lib/supabase-auth.js";
import { supabase } from "../config/supabase.js";
import { showSignOutModal } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";

const logOutBtn = document.getElementById("sign-out");
let currentStudent = null;
let currentFilter = 'all';

document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();
  setupEventListeners();
  loadNotifications();
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
  // Navigation
  document.querySelector(".nav-item:not(.active)").addEventListener("click", function () {
    window.location.href = "../pages/dashboard.html";
  });

  document.querySelector(".nav-item.courses").addEventListener("click", function () {
    window.location.href = "../pages/courses.html";
  });

  document.querySelector(".nav-item.schedule").addEventListener("click", function () {
    window.location.href = "../pages/schedule.html";
  });

  document.querySelector(".nav-item.resources").addEventListener("click", function () {
    window.location.href = "../pages/resources.html";
  });

  document.querySelector(".nav-item.finances").addEventListener("click", function () {
    window.location.href = "../pages/finances.html";
  });

  document.querySelector(".nav-item.events").addEventListener("click", function () {
    window.location.href = "../pages/events.html";
  });

  document.querySelector(".nav-item.settings").addEventListener("click", function () {
    window.location.href = "../pages/settings.html";
  });

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter');
      filterNotifications();
    });
  });

  // Mark all as read
  document.getElementById('markAllReadBtn').addEventListener('click', markAllAsRead);

  logOutBtn.addEventListener("click", () => {
    showSignOutModal();
  });
}

async function loadNotifications() {
  const notificationsList = document.getElementById('notificationsList');
  notificationsList.innerHTML = '<div class="loading">Loading notifications...</div>';

  try {
    // Get student info
    const studentResult = await getStudentInfo();
    if (!studentResult.success || !studentResult.studentInfo) {
      notificationsList.innerHTML = '<div class="error">Please log in to view notifications</div>';
      return;
    }

    currentStudent = studentResult.studentInfo;
    const studentYear = `year-${currentStudent.year}`;

    // Fetch announcements
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .or(`target_audience.eq.all,target_audience.eq.${studentYear}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!announcements || announcements.length === 0) {
      notificationsList.innerHTML = `
        <div class="no-notifications">
          <i class="fas fa-bell-slash"></i>
          <h3>No Notifications</h3>
          <p>You're all caught up! Check back later for updates.</p>
        </div>
      `;
      return;
    }

    // Fetch read status
    const { data: reads, error: readsError } = await supabase
      .from('announcement_reads')
      .select('announcement_id')
      .eq('student_id', currentStudent.student_id);

    if (readsError) console.error('Error fetching reads:', readsError);

    const readIds = new Set(reads?.map(r => r.announcement_id) || []);

    // Render notifications
    renderNotifications(announcements, readIds);
    updateBadgeCount(announcements.length - readIds.size);

  } catch (error) {
    console.error('Error loading notifications:', error);
    notificationsList.innerHTML = '<div class="error">Failed to load notifications</div>';
  }
}

function renderNotifications(announcements, readIds) {
  const notificationsList = document.getElementById('notificationsList');
  
  notificationsList.innerHTML = announcements.map(announcement => {
    const isRead = readIds.has(announcement.id);
    const isUrgent = announcement.is_urgent;
    const icon = getTypeIcon(announcement.type);
    const timeAgo = getTimeAgo(announcement.created_at);

    return `
      <div class="notification-card ${!isRead ? 'unread' : ''} ${isUrgent ? 'urgent' : ''}" 
           data-id="${announcement.id}" 
           data-type="${announcement.type}"
           data-read="${isRead}"
           onclick="markAsRead('${announcement.id}')">
        ${!isRead ? '<div class="unread-indicator"></div>' : ''}
        <div class="notification-header">
          <div class="notification-title-wrapper">
            <div class="notification-icon-badge ${announcement.type}">
              <i class="fas fa-${icon}"></i>
            </div>
            <div>
              <div class="notification-title">${announcement.title}</div>
              <span class="notification-type-badge ${announcement.type}">${announcement.type}</span>
            </div>
          </div>
        </div>
        <div class="notification-message">${announcement.message}</div>
        <div class="notification-footer">
          <div class="notification-time">
            <i class="fas fa-clock"></i>
            <span>${timeAgo}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getTypeIcon(type) {
  const icons = {
    urgent: 'exclamation-circle',
    academic: 'graduation-cap',
    financial: 'dollar-sign',
    event: 'calendar-alt',
    general: 'info-circle'
  };
  return icons[type] || 'bell';
}

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function markAsRead(announcementId) {
  if (!currentStudent) return;

  try {
    const { error } = await supabase
      .from('announcement_reads')
      .insert([{
        announcement_id: announcementId,
        student_id: currentStudent.student_id
      }]);

    if (error && error.code !== '23505') { // Ignore duplicate key error
      throw error;
    }

    // Update UI
    const card = document.querySelector(`[data-id="${announcementId}"]`);
    if (card) {
      card.classList.remove('unread');
      card.setAttribute('data-read', 'true');
      const indicator = card.querySelector('.unread-indicator');
      if (indicator) indicator.remove();
    }

    // Update badge
    const unreadCount = document.querySelectorAll('.notification-card.unread').length;
    updateBadgeCount(unreadCount);

  } catch (error) {
    console.error('Error marking as read:', error);
  }
}

async function markAllAsRead() {
  if (!currentStudent) return;

  const unreadCards = document.querySelectorAll('.notification-card.unread');
  if (unreadCards.length === 0) return;

  try {
    const reads = Array.from(unreadCards).map(card => ({
      announcement_id: card.getAttribute('data-id'),
      student_id: currentStudent.student_id
    }));

    const { error } = await supabase
      .from('announcement_reads')
      .insert(reads);

    if (error && error.code !== '23505') {
      throw error;
    }

    // Update UI
    unreadCards.forEach(card => {
      card.classList.remove('unread');
      card.setAttribute('data-read', 'true');
      const indicator = card.querySelector('.unread-indicator');
      if (indicator) indicator.remove();
    });

    updateBadgeCount(0);

  } catch (error) {
    console.error('Error marking all as read:', error);
  }
}

function filterNotifications() {
  const cards = document.querySelectorAll('.notification-card');
  
  cards.forEach(card => {
    const type = card.getAttribute('data-type');
    const isRead = card.getAttribute('data-read') === 'true';
    const isUrgent = card.classList.contains('urgent');

    let show = false;

    if (currentFilter === 'all') {
      show = true;
    } else if (currentFilter === 'unread') {
      show = !isRead;
    } else if (currentFilter === 'urgent') {
      show = isUrgent;
    } else {
      show = type === currentFilter;
    }

    card.style.display = show ? 'block' : 'none';
  });
}

function updateBadgeCount(count) {
  const badge = document.getElementById('notificationBadge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  }
}

// Expose functions globally
window.markAsRead = markAsRead;

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
