import { signUpStudent } from "../lib/supabase-auth.js";
import checkFormValidity from "../lib/validate-form.js";
import { removeAlert } from "../lib/pop-up.js";
import { setTheme } from "../lib/theme.js";

console.log("Sign-up script loaded");

const signUpForm = document.getElementById("sign-up-form");
const studentID = document.getElementById("id");
const firstName = document.getElementById("first_name");
const lastName = document.getElementById("last_name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const gender = document.getElementById("gender");
const course = document.getElementById("course");
const certificate = document.getElementById("certificate");
const year = document.getElementById("year");
const password = document.getElementById("password");
const signUpBtn = document.getElementById("sign-up-btn");

console.log("Sign-up button:", signUpBtn);

const cleanseString = (string) => {
  return string
    .replace(/[^a-zA-Z]/g, "")
    .toLocaleLowerCase()
    .trim();
};

const signUp = async () => {
  console.log("Sign-up function called");
  
  let data = {
    studentID: studentID.value,
    first_name: cleanseString(firstName.value),
    last_name: cleanseString(lastName.value),
    email: email.value,
    phone: phone.value,
    address: address.value,
    gender: gender.value,
    course: course.value,
    certificate: certificate.value,
    year: year.value,
    password: password.value,
  };

  console.log("Sign-up data:", { ...data, password: "***" });

  const result = await signUpStudent(data);
  console.log("Sign-up result:", result);
  
  if (result.success) {
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 2000);
  } else {
    setTimeout(() => {
      removeAlert();
    }, 2000);
  }
};

if (signUpBtn) {
  signUpBtn.addEventListener("click", (e) => {
    console.log("Sign-up button clicked");
    e.preventDefault();
    if (checkFormValidity(signUpForm)) {
      console.log("Form is valid, calling signUp");
      signUp();
    } else {
      console.log("Form validation failed");
    }
  });
} else {
  console.error("Sign-up button not found!");
}

window.addEventListener("load", () => {
  let currTheme = localStorage.getItem("theme");
  if (!currTheme) {
    currTheme = "light";
  }
  setTheme(currTheme);
});
