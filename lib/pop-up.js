import { signOutStudent } from "./auth.js";

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

export const showSignOutModal = () => {
  const docBody = document.querySelector("body");
  const modal = document.createElement("div");
  modal.classList.add("modal-wrapper");
  modal.setAttribute("id", "modal");

  modal.innerHTML = `
  <div class="modal">
    <h1>You are about to sign out</h1>
    <p>Do you wish to continue this action?</p>
    <div class="modal-btns">
      <button id="modal-cancel" class="cancel">Cancel</button>
      <button id="modal-continue" class="continue">Continue</button>
    </div>
  </div>
`;
  docBody.appendChild(modal);

  const cancelBtn = document.getElementById("modal-cancel");
  const continueBtn = document.getElementById("modal-continue");

  cancelBtn.addEventListener("click", () => {
    removeSignOutModal();
  });

  continueBtn.addEventListener("click", () => {
    signOutStudent();
    removeSignOutModal();
  });
};

export const removeSignOutModal = () => {
  const docBody = document.querySelector("body");
  const modal = document.getElementById("modal");
  docBody.removeChild(modal);
};
