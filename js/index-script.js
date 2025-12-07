console.log('🔄 Index script loading...');

// Try to import Supabase auth, but don't fail if it doesn't work
let isLoggedIn = async () => {
  console.warn('⚠️ Supabase not loaded, assuming not logged in');
  return false;
};

try {
  const authModule = await import("../lib/supabase-auth.js");
  isLoggedIn = authModule.isLoggedIn;
  console.log('✅ Supabase auth module loaded successfully');
} catch (error) {
  console.error('❌ Failed to load Supabase auth module:', error);
  console.log('⚠️ Continuing with fallback authentication');
}

const loginBtn = document.getElementById("login");
const signUpBtn = document.getElementById("sign-up");
const mainWeb = document.getElementById("mainWeb");
const supportBtn = document.getElementById("support-btn");
const faqBtn = document.getElementById("faq-btn");

console.log('Buttons found:', { loginBtn, signUpBtn, mainWeb, supportBtn, faqBtn });

async function redirectToLogin() {
  try {
    console.log('Checking login status...');
    const loggedIn = await isLoggedIn();
    if (loggedIn) {
      console.log('User is logged in, redirecting to dashboard');
      window.location.href = "pages/dashboard.html";
    } else {
      console.log('User not logged in, redirecting to login page');
      window.location.href = "pages/login.html";
    }
  } catch (error) {
    console.error('Login check failed:', error);
    window.location.href = "pages/login.html";
  }
}

function redirectToSignup() {
  console.log('Redirecting to signup page');
  window.location.href = "pages/sign-up.html";
}

function redirectToSupport() {
  console.log('Redirecting to FAQ/Support page');
  window.location.href = "pages/faq.html";
}

function redirectToFAQ() {
  console.log('Redirecting to FAQ page');
  window.location.href = "pages/faq.html";
}

function redirectToWebsite() {
  console.log('Redirecting to main website');
  window.location.href = "https://www.gcc-ed.com/";
}

// Add event listeners
if (loginBtn) {
  loginBtn.addEventListener("click", redirectToLogin);
  console.log('✅ Login button listener attached');
}

if (signUpBtn) {
  signUpBtn.addEventListener("click", redirectToSignup);
  console.log('✅ Sign up button listener attached');
}

if (supportBtn) {
  supportBtn.addEventListener("click", redirectToSupport);
  console.log('✅ Support button listener attached');
}

if (faqBtn) {
  faqBtn.addEventListener("click", redirectToFAQ);
  console.log('✅ FAQ button listener attached');
}

if (mainWeb) {
  mainWeb.addEventListener("click", redirectToWebsite);
  console.log('✅ Website button listener attached');
}

console.log('✅ All event listeners attached successfully');

const isMobile = () => window.innerWidth <= 768;
if (isMobile()) {
  console.log("📱 Mobile device detected");
}
