import { removeLoading, showLoading } from "../lib/loading.js";
import { isLoggedIn } from "../lib/check-login.js";
import postData from "../lib/post-data.js";
import checkFormValidity from "../lib/validate-form.js";
import { removeAlert, showAlert } from "../lib/pop-up.js";
const loginForm = document.getElementById("login-form");
const password = document.getElementById("password");
const studentID = document.getElementById("id");
const loginBtn = document.getElementById("login-btn");
const loginUrl = "https://sp-server-ts.onrender.com/api/login";
//const loginUrl = "http://localhost:6969/api/login";

const login = () => {
  showLoading("logging in..");
  let data = {
    studentID: studentID.value,
    password: password.value,
  };

  const onSuccess = () => {
    removeLoading();
    const timer = setTimeout(() => {
      location.reload();
      if (isLoggedIn()) {
        window.location.href = "dashboard.html";
      }
      clearTimeout(timer);
    }, 1000);
  };

  const onFail = (message) => {
    let title = "Login error";
    removeLoading();
    showAlert(title, message);
    const timer = setTimeout(() => {
      removeAlert();
      clearTimeout(timer);
    }, 3000);
  };

  postData(loginUrl, data, onSuccess, onFail);
};

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (checkFormValidity(loginForm)) {
    login();
  }
});
