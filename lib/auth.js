import CONFIG from "../config/config.js";
import { removeLoading, showLoading } from "./loading.js";
import { showAlert } from "./pop-up.js";
import postData from "./post-data.js";
import getData from "./get-data.js";
const signOutUrl = CONFIG.logoutEP;

export function signOutStudent() {
  showLoading("Signing out...");
  const jsonValue = localStorage.getItem("stu");

  const onSuccess = () => {
    removeLoading();
    localStorage.removeItem("stu");
    localStorage.removeItem("stu-info");
    localStorage.removeItem("stu-schedule");
    localStorage.setItem("theme", "light");
    location.href = "../index.html";
  };

  const onFail = (message) => {
    let title = "Sign out error";
    removeLoading();
    showAlert(title, message);
  };

  if (jsonValue) {
    try {
      const studentDetails = JSON.parse(jsonValue);
      postData(signOutUrl, { id: studentDetails._id }, onSuccess, onFail);
    } catch (e) {
      console.error("Error parsing student data:", e);
      showAlert("Session error", e.message);
    }
  } else {
    showAlert("Session error", "Session failed to sign out");
    console.log("Failed to sign out");
  }
}

export function studentInfo() {
  showLoading("Verifying...");
  const jsonStuValue = localStorage.getItem("stu");
  const jsonStuInfo = localStorage.getItem("stu-info");

  if (jsonStuInfo) {
    removeLoading();
    return;
  }

  const onSuccess = () => {
    removeLoading();
  };

  const onFail = (message) => {
    let title = "Verifacation error";
    removeLoading();
    showAlert(title, message);
  };

  if (jsonStuValue) {
    try {
      const studentDetails = JSON.parse(jsonStuValue);
      const studentInfoUrl =
        CONFIG.stidentInfoEP + `${studentDetails.studentID}`;
      getData(studentInfoUrl, "stu-info", onSuccess, onFail);
    } catch (e) {
      console.error("Error parsing student data:", e);
      showAlert("Session error", e.message);
    }
  } else {
    showAlert("Session error", "Session failed to verify");
    console.log("Failed to verify");
  }
}
