import { removeStudentDetails, storeStudentDetails } from "./local-storage.js";

const getData = async (url, key, successCallBack, failCallBack) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    const content = await response.json();
    const { message, ...data } = content;
    if (!response.ok) {
      console.log(message);
      failCallBack(message);
    } else {
      removeStudentDetails(key);
      storeStudentDetails(key, data);
      successCallBack();
    }
  } catch (error) {
    //console.log(error);
    failCallBack(error.message);
  }
};

export default getData;
