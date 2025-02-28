export const showAlert = (title, message) => {
  const docBody = document.querySelector("body");
  const alert = document.createElement("div");
  const alertTitle = document.createElement("h1");
  const alertMessage = document.createElement("p");

  alert.setAttribute("id", "alert");
  alertTitle.innerText = title;
  alertMessage.innerText = message;

  alert.appendChild(alertTitle);
  alert.appendChild(alertMessage);
  alert.classList.add("alert");

  docBody.appendChild(alert);
};

export const removeAlert = () => {
  const docBody = document.querySelector("body");
  const alert = document.getElementById("alert");
  docBody.removeChild(alert);
};
