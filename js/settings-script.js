import { isLoggedIn, getStudentInfo, supabase } from "../lib/supabase-auth.js";
import { showSignOutModal } from "../lib/pop-up.js";
import { saveTheme, setTheme } from "../lib/theme.js";
import { showAlert } from "../lib/pop-up.js";

const logOutBtn = document.getElementById("sign-out");
const darkThemeToggle = document.getElementById("dark-theme-toggle");
let currentStudent = null;

document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();
  loadStudentProfile();
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

darkThemeToggle.addEventListener("change", (e) => {
  const isActive = e.target.checked;
  if (isActive) {
    saveTheme("dark");
    let currTheme = localStorage.getItem("theme");
    setTheme(currTheme);
  } else {
    saveTheme("light");
    let currTheme = localStorage.getItem("theme");
    setTheme(currTheme);
  }
});

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

logOutBtn.addEventListener("click", () => {
  showSignOutModal();
});

// Load student profile data
async function loadStudentProfile() {
  try {
    const result = await getStudentInfo();
    if (!result.success || !result.studentInfo) {
      showAlert('Failed to load profile', 'error');
      return;
    }

    currentStudent = result.studentInfo;
    
    // Populate form fields
    document.getElementById('firstName').value = currentStudent.first_name || '';
    document.getElementById('lastName').value = currentStudent.last_name || '';
    document.getElementById('studentId').value = currentStudent.student_id || '';
    document.getElementById('course').value = currentStudent.course || 'Information Technology';
    document.getElementById('email').value = currentStudent.email || '';
    document.getElementById('phone').value = currentStudent.phone || '';
    
    // Set profile picture
    const profilePic = document.getElementById('profilePicture');
    if (currentStudent.profile_image) {
      profilePic.src = currentStudent.profile_image;
    }
    
  } catch (error) {
    console.error('Error loading profile:', error);
    showAlert('Failed to load profile', 'error');
  }
}

function setupEventListeners() {
  // Profile picture upload
  const profilePictureWrapper = document.querySelector('.profile-picture-wrapper');
  const profilePictureInput = document.getElementById('profilePictureInput');
  
  profilePictureWrapper.addEventListener('click', () => {
    profilePictureInput.click();
  });
  
  profilePictureInput.addEventListener('change', handleProfilePictureUpload);
  
  // Remove profile picture
  document.getElementById('removeProfilePicture').addEventListener('click', removeProfilePicture);
  
  // Profile form submit
  document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
  
  // Password form submit
  document.getElementById('passwordForm').addEventListener('submit', handlePasswordChange);
  
  // Toggle password visibility
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = this.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
}

// Compress and resize image
async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.8);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

async function handleProfilePictureUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    showAlert('Please select an image file', 'error');
    return;
  }
  
  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    showAlert('Image size must be less than 2MB', 'error');
    return;
  }
  
  try {
    showAlert('Uploading image...', 'info');
    
    // Compress image
    const compressedBlob = await compressImage(file);
    
    // Create file path
    const fileExt = 'jpg';
    const fileName = `${currentStudent.student_id}-${Date.now()}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('resources')
      .upload(filePath, compressedBlob, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('resources')
      .getPublicUrl(filePath);
    
    const publicUrl = urlData.publicUrl;
    
    // Update database
    const { error: updateError } = await supabase
      .from('students')
      .update({ profile_image: publicUrl })
      .eq('student_id', currentStudent.student_id);
    
    if (updateError) throw updateError;
    
    // Update UI
    document.getElementById('profilePicture').src = publicUrl;
    currentStudent.profile_image = publicUrl;
    
    showAlert('Profile picture updated successfully!', 'success');
    
  } catch (error) {
    console.error('Error uploading image:', error);
    showAlert('Failed to upload image: ' + error.message, 'error');
  }
}

async function removeProfilePicture() {
  if (!confirm('Are you sure you want to remove your profile picture?')) {
    return;
  }
  
  try {
    // Update database to null
    const { error } = await supabase
      .from('students')
      .update({ profile_image: null })
      .eq('student_id', currentStudent.student_id);
    
    if (error) throw error;
    
    // Update UI
    document.getElementById('profilePicture').src = '../assets/fallback-icon.png';
    currentStudent.profile_image = null;
    
    showAlert('Profile picture removed', 'success');
    
  } catch (error) {
    console.error('Error removing image:', error);
    showAlert('Failed to remove image: ' + error.message, 'error');
  }
}

async function handleProfileUpdate(e) {
  e.preventDefault();
  
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  
  try {
    const { error } = await supabase
      .from('students')
      .update({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone
      })
      .eq('student_id', currentStudent.student_id);
    
    if (error) throw error;
    
    currentStudent.first_name = firstName;
    currentStudent.last_name = lastName;
    currentStudent.email = email;
    currentStudent.phone = phone;
    
    showAlert('Profile updated successfully!', 'success');
    
  } catch (error) {
    console.error('Error updating profile:', error);
    showAlert('Failed to update profile: ' + error.message, 'error');
  }
}

async function handlePasswordChange(e) {
  e.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Validate passwords match
  if (newPassword !== confirmPassword) {
    showAlert('New passwords do not match', 'error');
    return;
  }
  
  // Validate password length
  if (newPassword.length < 6) {
    showAlert('Password must be at least 6 characters', 'error');
    return;
  }
  
  try {
    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: currentStudent.email,
      password: currentPassword
    });
    
    if (signInError) {
      showAlert('Current password is incorrect', 'error');
      return;
    }
    
    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    // Clear form
    document.getElementById('passwordForm').reset();
    
    showAlert('Password changed successfully!', 'success');
    
  } catch (error) {
    console.error('Error changing password:', error);
    showAlert('Failed to change password: ' + error.message, 'error');
  }
}

window.addEventListener("load", async () => {
  let currTheme = localStorage.getItem("theme");
  if (!currTheme) {
    currTheme = "light";
  }
  if (currTheme == "dark") {
    darkThemeToggle.checked = true;
  }
  setTheme(currTheme);
  
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    location.href = "../index.html";
  }
});
