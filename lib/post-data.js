import { removeStudentDetails, storeStudentDetails } from "./local-storage.js";

const postData = async (url, data, successCallBack, failCallBack) => {
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
      failCallBack(content.message);
    } else {
      removeStudentDetails("stu");
      storeStudentDetails("stu", content.student);
      successCallBack();
    }
  } catch (error) {
    console.log(error);
  }
};

export default postData;
