import { removeLoading, showLoading } from "../lib/loading.js";
import { showAlert } from "../lib/pop-up.js";
import postData from "../lib/post-data.js";
const signOutUrl = "https://sp-server-ts.onrender.com/api/logout";

export function signOutStudent() {
  showLoading("Signing out");
  const jsonValue = localStorage.getItem("stu");

  const onSuccess = () => {
    removeLoading();
    localStorage.clear();
    location.href = "../index.html";
  };

  const onFail = (message) => {
    let title = "Sign out error";
    removeLoading();
    showAlert(title, message);
    localStorage.clear();
    location.href = "../index.html";
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
