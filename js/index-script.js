import { isLoggedIn } from "../lib/supabase-auth.js";

const loginBtn = document.getElementById("login");
const signUpBtn = document.getElementById("sign-up");
const mainWeb = document.getElementById("mainWeb");

async function redirectToLogin() {
  const loggedIn = await isLoggedIn();
  if (loggedIn) {
    window.location.href = "pages/dashboard.html";
  } else {
    window.location.href = "pages/login.html";
  }
}

function redirectToSignup() {
  window.location.href = "pages/sign-up.html";
}

function redirectToSupport() {
  window.location.href = "pages/faq.html";
}

function redirectToFAQ() {
  window.location.href = "pages/faq.html";
}

function redirectToWebsite() {
  window.location.href = "https://www.gcc-ed.com/";
}

// Make functions available globally for onclick handlers
window.redirectToSupport = redirectToSupport;
window.redirectToFAQ = redirectToFAQ;

loginBtn.addEventListener("click", () => {
  redirectToLogin();
});

signUpBtn.addEventListener("click", () => {
  redirectToSignup();
});

mainWeb.addEventListener("click", () => {
  redirectToWebsite();
});

const isMobile = () => window.innerWidth <= 768;
if (isMobile()) {
  console.log("Mobile");
}

