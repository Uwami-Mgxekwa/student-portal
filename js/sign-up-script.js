import checkFormValidity from "../lib/validate-form.js";
import postData from "../lib/post-data.js";
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
const registerUrl = "https://sp-server-ts.onrender.com/api/register";
//const registerUrl = "http://localhost:6969/api/register";

const cleanseString = (string) => {
  return string
    .replace(/[^a-zA-Z]/g, "")
    .toLocaleLowerCase()
    .trim();
};

const signUp = () => {
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
  postData(registerUrl, data);
};

signUpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (checkFormValidity(signUpForm)) {
    signUp();
  }
});
