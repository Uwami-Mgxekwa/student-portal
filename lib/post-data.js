import { isLoggedIn } from "./check-login.js";
import { removeStudentDetails, storeStudentDetails } from "./local-storage.js";

const postData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    });

    const content = await response.json();
    if (!response.ok) {
      console.log(content.message);
    } else {
      removeStudentDetails("stu");
      storeStudentDetails("stu", content.student);
      const timer = setTimeout(() => {
        location.reload();
        if (isLoggedIn()) {
          window.location.href = "dashboard.html";
        }
        clearTimeout(timer);
      }, 3000);
    }
  } catch (error) {
    console.log(error);
  }
};

export default postData;
