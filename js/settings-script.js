import { isLoggedIn, getStudentInfo } from "../lib/back4app-auth.js";
import { supabase } from "../config/back4app.js";
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

logOutBtn.addEventListener("click", () => {
  showSignOutModal();
});

// Load student profile data
async function loadStudentProfile() {
  try {
    const result = await getStudentInfo();
    if (!result.success || !result.student) {
      showAlert('Error', 'Failed to load profile', 'error');
      return;
    }

    // Merge student (user fields) and studentInfo (academic fields) into currentStudent
    currentStudent = {
      ...result.student,
      ...(result.studentInfo || {})
    };
    
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
    showAlert('Error', 'Failed to load profile', 'error');
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
  
  if (!file.type.startsWith('image/')) {
    showAlert('Invalid File', 'Please select an image file', 'error');
    return;
  }
  
  if (file.size > 2 * 1024 * 1024) {
    showAlert('File Too Large', 'Image size must be less than 2MB', 'error');
    return;
  }
  
  try {
    showAlert('Uploading', 'Uploading image...', 'info');
    
    const compressedBlob = await compressImage(file);
    const fileName = `profile-${currentStudent.student_id}-${Date.now()}.jpg`;
    
    // Upload using Parse File
    const parseFile = new Parse.File(fileName, compressedBlob);
    await parseFile.save();
    const publicUrl = parseFile.url();
    
    // Update Parse User
    const user = Parse.User.current();
    if (user) {
      user.set('profile_image', publicUrl);
      await user.save();
    }
    
    document.getElementById('profilePicture').src = publicUrl;
    currentStudent.profile_image = publicUrl;
    
    showAlert('Success', 'Profile picture updated successfully!', 'success');
    
  } catch (error) {
    console.error('Error uploading image:', error);
    showAlert('Upload Failed', 'Failed to upload image: ' + error.message, 'error');
  }
}

async function removeProfilePicture() {
  if (!confirm('Are you sure you want to remove your profile picture?')) return;
  
  try {
    const user = Parse.User.current();
    if (user) {
      user.unset('profile_image');
      await user.save();
    }
    
    document.getElementById('profilePicture').src = '../assets/fallback-icon.png';
    currentStudent.profile_image = null;
    
    showAlert('Success', 'Profile picture removed', 'success');
    
  } catch (error) {
    console.error('Error removing image:', error);
    showAlert('Error', 'Failed to remove image: ' + error.message, 'error');
  }
}

async function handleProfileUpdate(e) {
  e.preventDefault();
  
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  
  try {
    const user = Parse.User.current();
    if (!user) throw new Error('Not logged in');
    
    user.set('first_name', firstName);
    user.set('last_name', lastName);
    user.set('email', email);
    user.set('phone', phone);
    await user.save();
    
    currentStudent.first_name = firstName;
    currentStudent.last_name = lastName;
    currentStudent.email = email;
    currentStudent.phone = phone;
    
    showAlert('Success', 'Profile updated successfully!', 'success');
    
  } catch (error) {
    console.error('Error updating profile:', error);
    showAlert('Update Failed', 'Failed to update profile: ' + error.message, 'error');
  }
}

async function handlePasswordChange(e) {
  e.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (newPassword !== confirmPassword) {
    showAlert('Password Mismatch', 'New passwords do not match', 'error');
    return;
  }
  
  if (newPassword.length < 6) {
    showAlert('Invalid Password', 'Password must be at least 6 characters', 'error');
    return;
  }
  
  try {
    // Verify current password by re-logging in
    const user = Parse.User.current();
    if (!user) throw new Error('Not logged in');
    
    await Parse.User.logIn(user.get('username'), currentPassword);
    
    // Update password
    user.setPassword(newPassword);
    await user.save();
    
    document.getElementById('passwordForm').reset();
    showAlert('Success', 'Password changed successfully!', 'success');
    
  } catch (error) {
    console.error('Error changing password:', error);
    if (error.code === 101) {
      showAlert('Authentication Failed', 'Current password is incorrect', 'error');
    } else {
      showAlert('Password Change Failed', 'Failed to change password: ' + error.message, 'error');
    }
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
