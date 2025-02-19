import postData from "../lib/post-data.js";
import checkFormValidity from "../lib/validate-form.js";
const loginForm = document.getElementById("login-form");
const password = document.getElementById("password");
const studentID = document.getElementById("id");
const loginBtn = document.getElementById("login-btn");
const loginUrl = "https://sp-server-ts.onrender.com/api/login";
//const loginUrl = "http://localhost:6969/api/login";

const login = () => {
  let data = {
    studentID: studentID.value,
    password: password.value,
  };
  postData(loginUrl, data);
};

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (checkFormValidity(loginForm)) {
    login();
  }
});
