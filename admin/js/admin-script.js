// ============================================
// ADMIN PANEL WITH SUPABASE STORAGE INTEGRATION
// ============================================

// Supabase Configuration
const SUPABASE_URL = 'https://qnroaigdrpoceasbqtmh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucm9haWdkcnBvY2Vhc2JxdG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzIzMzgsImV4cCI6MjA3ODEwODMzOH0.AnySEJv5FLNikQ6aGlpg-p7YSpqINjvbMuuLe4SFKQc';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Storage bucket name
const STORAGE_BUCKET = 'resources';

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const mainContent = document.getElementById('mainContent');
const currentDateEl = document.getElementById('currentDate');
const greeting = document.getElementById('greeting');
const signOutBtn = document.getElementById('sign-out');

// Page elements
const dashboardPage = document.getElementById('dashboardPage');
const studentsPage = document.getElementById('studentsPage');
const filesPage = document.getElementById('filesPage');

// Modal elements
const uploadFileModal = document.getElementById('uploadFileModal');
const uploadFileForm = document.getElementById('uploadFileForm');
const closeModalBtns = document.querySelectorAll('.close-modal, .btn-cancel');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
  setupEventListeners();
  loadDashboardStats();
});

function initDashboard() {
  setCurrentDate();
  setGreeting();
  checkAuth();
}

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '../index.html';
    return;
  }
  
  greeting.textContent = `Welcome, Admin`;
}

function setCurrentDate() {
  const date = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDateEl.textContent = date.toLocaleDateString('en-US', options);
}

function setGreeting() {
  const hour = new Date().getHours();
  let greetingText = 'Good ';
  
  if (hour < 12) {
    greetingText += 'Morning';
  } else if (hour < 18) {
    greetingText += 'Afternoon';
  } else {
    greetingText += 'Evening';
  }
  
  greeting.textContent = `${greetingText}, Admin`;
}

function setupEventListeners() {
  // Sidebar toggle
  menuToggle.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  
  // Navigation
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      if (this.classList.contains('sign-out')) {
        handleSignOut();
      } else {
        const page = this.getAttribute('data-page');
        if (page) {
          switchPage(page);
          navItems.forEach(i => i.classList.remove('active'));
          this.classList.add('active');
          
          if (window.innerWidth <= 768) {
            closeSidebar();
          }
        }
      }
    });
  });
  
  // Quick action buttons
  document.getElementById('viewStudentsBtn')?.addEventListener('click', () => switchPage('students'));
  document.getElementById('manageFilesBtn')?.addEventListener('click', () => switchPage('files'));
  
  // Upload file button
  document.getElementById('uploadFileBtn')?.addEventListener('click', () => openModal(uploadFileModal));
  
  // Modal close
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });
  
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      closeAllModals();
    }
  });
  
  // Upload form
  uploadFileForm.addEventListener('submit', handleFileUpload);
  
  // File upload drag and drop
  const fileUploadArea = document.getElementById('fileUploadArea');
  const fileUpload = document.getElementById('fileUpload');
  
  fileUploadArea.addEventListener('click', () => fileUpload.click());
  
  fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
  });
  
  fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('dragover');
  });
  
  fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      fileUpload.files = files;
      showFilePreview(files[0]);
    }
  });
  
  fileUpload.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      showFilePreview(e.target.files[0]);
    }
  });
  
  // Student search
  document.getElementById('studentSearch')?.addEventListener('input', (e) => {
    filterStudents(e.target.value);
  });
  
  // Sign out
  signOutBtn.addEventListener('click', handleSignOut);
  
  window.addEventListener('resize', handleResize);
}

function switchPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page-content').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  const pageMap = {
    'dashboard': dashboardPage,
    'students': studentsPage,
    'files': filesPage
  };
  
  const selectedPage = pageMap[pageName];
  if (selectedPage) {
    selectedPage.classList.add('active');
    
    // Load data for the page
    if (pageName === 'students') {
      loadStudents();
    } else if (pageName === 'files') {
      loadFiles();
    }
  }
}

async function loadDashboardStats() {
  try {
    // Get total students
    const { count: studentCount } = await supabase
      .from('student_info')
      .select('*', { count: 'exact', head: true });
    
    document.getElementById('totalStudents').textContent = studentCount || 0;
    
    // Get total files from resources table
    const { count: fileCount } = await supabase
      .from('resources')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    document.getElementById('totalFiles').textContent = fileCount || 0;
    
    // Active today (placeholder)
    document.getElementById('activeToday').textContent = '0';
    
  } catch (error) {
    console.error('Error loading stats:', error);
    showAlert('Failed to load dashboard stats', 'error');
  }
}

async function loadStudents() {
  const tbody = document.getElementById('studentsTableBody');
  tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading students...</td></tr>';
  
  try {
    const { data: students, error } = await supabase
      .from('student_info')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!students || students.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="no-data">No students found</td></tr>';
      return;
    }
    
    tbody.innerHTML = students.map(student => `
      <tr>
        <td>${student.student_id}</td>
        <td>${student.name || 'N/A'}</td>
        <td>${student.surname || 'N/A'}</td>
        <td>${student.course || 'Information Technology'}</td>
        <td>Year ${student.year || 'N/A'}</td>
        <td>${new Date(student.created_at).toLocaleDateString()}</td>
      </tr>
    `).join('');
    
  } catch (error) {
    console.error('Error loading students:', error);
    tbody.innerHTML = '<tr><td colspan="6" class="error">Failed to load students</td></tr>';
    showAlert('Failed to load students', 'error');
  }
}

function filterStudents(searchTerm) {
  const rows = document.querySelectorAll('#studentsTableBody tr');
  const term = searchTerm.toLowerCase();
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(term) ? '' : 'none';
  });
}

async function loadFiles() {
  const filesGrid = document.getElementById('filesGrid');
  filesGrid.innerHTML = '<div class="loading">Loading files...</div>';
  
  try {
    const { data: files, error } = await supabase
      .from('resources')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!files || files.length === 0) {
      filesGrid.innerHTML = '<div class="no-data">No files uploaded yet. Click "Upload File" to add resources.</div>';
      return;
    }
    
    filesGrid.innerHTML = files.map(file => `
      <div class="file-card" data-file-id="${file.id}">
        <div class="file-icon">
          <i class="fas fa-file-pdf"></i>
        </div>
        <div class="file-info">
          <h4>${file.title}</h4>
          <p class="file-category">${file.category}</p>
          <p class="file-meta">Year ${file.year === 'all' ? 'All' : file.year} • ${formatFileSize(file.file_size)}</p>
          <p class="file-downloads">${file.download_count || 0} downloads</p>
        </div>
        <div class="file-actions">
          <button class="btn-icon" onclick="downloadFile('${file.file_url}')" title="Download">
            <i class="fas fa-download"></i>
          </button>
          <button class="btn-icon btn-danger" onclick="deleteFile('${file.id}', '${file.storage_path}')" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
    
    // Update file count
    document.getElementById('totalFiles').textContent = files.length;
    
  } catch (error) {
    console.error('Error loading files:', error);
    filesGrid.innerHTML = '<div class="error">Failed to load files</div>';
    showAlert('Failed to load files', 'error');
  }
}

function formatFileSize(bytes) {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function showFilePreview(file) {
  const preview = document.getElementById('filePreview');
  preview.innerHTML = `
    <div class="file-preview-item">
      <i class="fas fa-file-pdf"></i>
      <span>${file.name}</span>
      <span class="file-size">${formatFileSize(file.size)}</span>
    </div>
  `;
}

async function handleFileUpload(e) {
  e.preventDefault();
  
  const fileName = document.getElementById('fileName').value.trim();
  const fileCategory = document.getElementById('fileCategory').value;
  const fileYear = document.getElementById('fileYear').value;
  const fileDescription = document.getElementById('fileDescription')?.value.trim() || '';
  const fileInput = document.getElementById('fileUpload');
  const file = fileInput.files[0];
  
  if (!file) {
    showAlert('Please select a file', 'error');
    return;
  }
  
  if (file.type !== 'application/pdf') {
    showAlert('Only PDF files are allowed', 'error');
    return;
  }
  
  if (file.size > 10 * 1024 * 1024) {
    showAlert('File size must be less than 10MB', 'error');
    return;
  }
  
  // Show loading
  const submitBtn = e.target.querySelector('.btn-submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
  submitBtn.disabled = true;
  
  try {
    // Create storage path based on year
    const yearFolder = fileYear === 'all' ? 'all-years' : `year-${fileYear}`;
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const storagePath = `${yearFolder}/${sanitizedFileName}-${timestamp}.pdf`;
    
    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);
    
    const publicUrl = urlData.publicUrl;
    
    // Insert record into resources table
    const { error: dbError } = await supabase
      .from('resources')
      .insert([{
        title: fileName,
        description: fileDescription,
        file_name: file.name,
        storage_path: storagePath,
        file_url: publicUrl,
        file_size: file.size,
        file_type: file.type,
        category: fileCategory,
        course: 'Information Technology',
        year: fileYear,
        is_active: true
      }])
      .select();
    
    if (dbError) throw dbError;
    
    showAlert(`File "${fileName}" uploaded successfully!`, 'success');
    
    closeAllModals();
    uploadFileForm.reset();
    document.getElementById('filePreview').innerHTML = '';
    
    // Reload files if on files page
    if (filesPage.classList.contains('active')) {
      loadFiles();
    }
    
    // Update dashboard stats
    loadDashboardStats();
    
  } catch (error) {
    console.error('Error uploading file:', error);
    showAlert(`Failed to upload file: ${error.message}`, 'error');
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

function downloadFile(fileUrl) {
  window.open(fileUrl, '_blank');
}

async function deleteFile(fileId, storagePath) {
  if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
    return;
  }
  
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);
    
    if (storageError) throw storageError;
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('resources')
      .delete()
      .eq('id', fileId);
    
    if (dbError) throw dbError;
    
    showAlert('File deleted successfully', 'success');
    
    // Reload files
    loadFiles();
    loadDashboardStats();
    
  } catch (error) {
    console.error('Error deleting file:', error);
    showAlert(`Failed to delete file: ${error.message}`, 'error');
  }
}

async function handleSignOut() {
  if (confirm('Are you sure you want to sign out?')) {
    await supabase.auth.signOut();
    window.location.href = '../index.html';
  }
}

function toggleSidebar() {
  sidebar.classList.toggle('collapsed');
  
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('active');
    sidebarOverlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
  }
}

function closeSidebar() {
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('active');
    sidebarOverlay.style.display = 'none';
  }
}

function handleResize() {
  if (window.innerWidth <= 768) {
    sidebar.classList.add('collapsed');
    sidebar.classList.remove('active');
    sidebarOverlay.style.display = 'none';
  }
}

function openModal(modal) {
  closeAllModals();
  modal.style.display = 'flex';
}

function closeAllModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.style.display = 'none';
  });
}

function showAlert(message, type = 'info') {
  const container = document.getElementById('alertContainer');
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  
  const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle';
  
  alert.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${message}</span>
    <button class="alert-close"><i class="fas fa-times"></i></button>
  `;
  
  container.appendChild(alert);
  
  setTimeout(() => alert.classList.add('show'), 10);
  
  alert.querySelector('.alert-close').addEventListener('click', () => {
    alert.classList.remove('show');
    setTimeout(() => alert.remove(), 300);
  });
  
  setTimeout(() => {
    if (alert.parentNode) {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 300);
    }
  }, 5000);
}
