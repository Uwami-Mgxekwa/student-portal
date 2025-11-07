import { signInStudent } from "../lib/supabase-auth.js";
import checkFormValidity from "../lib/validate-form.js";
import { removeAlert } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";

console.log("Login script loaded");

const loginForm = document.getElementById("login-form");
const password = document.getElementById("password");
const studentID = document.getElementById("id");
const loginBtn = document.getElementById("login-btn");

console.log("Login button:", loginBtn);

const login = async () => {
  console.log("Login function called");
  console.log("Student ID:", studentID.value);
  
  const result = await signInStudent(studentID.value, password.value);
  console.log("Login result:", result);
  
  if (result.success) {
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  } else {
    setTimeout(() => {
      removeAlert();
    }, 3000);
  }
};

if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    console.log("Login button clicked");
    e.preventDefault();
    if (checkFormValidity(loginForm)) {
      console.log("Form is valid, calling login");
      login();
    } else {
      console.log("Form validation failed");
    }
  });
} else {
  console.error("Login button not found!");
}

window.addEventListener("load", () => {
  let currTheme = localStorage.getItem("theme");
  if (!currTheme) {
    currTheme = "light";
  }
  setTheme(currTheme);
});
