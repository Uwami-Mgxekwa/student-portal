import { isLoggedIn } from "../lib/back4app-auth.js";

const loginBtn = document.getElementById("login");
const signUpBtn = document.getElementById("sign-up");
const mainWeb = document.getElementById("mainWeb");
const supportBtn = document.getElementById("support-btn");
const faqBtn = document.getElementById("faq-btn");

async function redirectToLogin() {
  try {
    const loggedIn = await isLoggedIn();
    if (loggedIn) {
      window.location.href = "pages/dashboard.html";
    } else {
      window.location.href = "pages/login.html";
    }
  } catch (error) {
    window.location.href = "pages/login.html";
  }
}

if (loginBtn) loginBtn.addEventListener("click", redirectToLogin);
if (signUpBtn) signUpBtn.addEventListener("click", () => { window.location.href = "pages/sign-up.html"; });
if (supportBtn) supportBtn.addEventListener("click", () => { window.location.href = "pages/faq.html"; });
if (faqBtn) faqBtn.addEventListener("click", () => { window.location.href = "pages/faq.html"; });
if (mainWeb) mainWeb.addEventListener("click", () => { window.location.href = "https://www.gcc-ed.com/"; });
