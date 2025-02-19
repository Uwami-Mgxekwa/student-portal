import { isLoggedIn } from "../lib/check-login.js";
const loginBtn = document.getElementById("login");
const signUpBtn = document.getElementById("sign-up");

function redirectToLogin() {
  if (isLoggedIn()) {
    window.location.href = "pages/dashboard.html";
  } else {
    window.location.href = "pages/login.html";
  }
}

function redirectToSignup() {
  window.location.href = "pages/sign-up.html";
}

function redirectToSupport() {
  alert("Support page is under construction. Check back soon!");
  // window.location.href = "https://example.com/support";
}

function redirectToFAQ() {
  alert("FAQ page is under construction. Check back soon!");
  // window.location.href = "https://example.com/faq";
}

function redirectToWebsite() {
  window.location.href = "https://www.gcc-ed.com/";
}

loginBtn.addEventListener("click", () => {
  redirectToLogin();
});

signUpBtn.addEventListener("click", () => {
  redirectToSignup();
});
