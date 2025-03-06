import CONFIG from "../config/config.js";
import checkFormValidity from "../lib/validate-form.js";
import postData from "../lib/post-data.js";
import { removeLoading, showLoading } from "../lib/loading.js";
import { showAlert, removeAlert } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";
const signUpForm = document.getElementById("sign-up-form");
const studentID = document.getElementById("id");
const firstName = document.getElementById("first_name");
const lastName = document.getElementById("last_name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const gender = document.getElementById("gender");
const password = document.getElementById("password");
const signupCheck = document.getElementById("signupCheck");
const signUpBtn = document.getElementById("sign-up-btn");
const registerUrl = CONFIG.registerEP;
//const registerUrl = "http://localhost:6969/api/register";

const cleanseString = (string) => {
  return string
    .replace(/[^a-zA-Z]/g, "")
    .toLocaleLowerCase()
    .trim();
};

const signUp = () => {
  showLoading("Signing up...");
  let data = {
    studentID: studentID.value,
    first_name: cleanseString(firstName.value),
    last_name: cleanseString(lastName.value),
    email: email.value,
    phone: phone.value,
    address: address.value,
    gender: gender.value,
    password: password.value,
    signupCheck: signupCheck.value,
  };

  const onSuccess = () => {
    removeLoading();
    const timer = setTimeout(() => {
      location.reload();
      if (isLoggedIn()) {
        window.location.href = "dashboard.html";
      }
      clearTimeout(timer);
    }, 2000);
  };

  const onFail = (message) => {
    let title = "Sign up error";
    removeLoading();
    showAlert(title, message);
    const timer = setTimeout(() => {
      removeAlert();
      clearTimeout(timer);
    }, 2000);
  };

  postData(registerUrl, data, onSuccess, onFail);
};

signUpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (checkFormValidity(signUpForm)) {
    signUp();
  }
});

window.addEventListener("load", () => {
  let currTheme = localStorage.getItem("theme");
  if (!currTheme) {
    currTheme = "light";
  }
  setTheme(currTheme);
});
