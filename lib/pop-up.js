import { signOutStudent } from "./supabase-auth.js";

export const showAlert = (title, message, type = "error") => {
  const docBody = document.querySelector("body");
  
  // Remove existing alert if any
  const existingAlert = document.getElementById("alert");
  if (existingAlert) {
    existingAlert.remove();
  }
  
  const alert = document.createElement("div");
  const alertTitle = document.createElement("h1");
  const alertMessage = document.createElement("p");
  const closeBtn = document.createElement("button");

  alert.setAttribute("id", "alert");
  alertTitle.innerText = title;
  alertMessage.innerText = message;
  
  // Add close button
  closeBtn.innerHTML = "&times;";
  closeBtn.classList.add("alert-close");
  closeBtn.onclick = () => removeAlert();

  alert.appendChild(closeBtn);
  alert.appendChild(alertTitle);
  alert.appendChild(alertMessage);
  alert.classList.add("alert");
  
  // Add type-specific class for styling
  if (type === "success") {
    alert.classList.add("alert-success");
  } else if (type === "error") {
    alert.classList.add("alert-error");
  }

  docBody.appendChild(alert);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (document.getElementById("alert")) {
      removeAlert();
    }
  }, 5000);
};

export const removeAlert = () => {
  const alert = document.getElementById("alert");
  if (alert) {
    alert.remove();
  }
};

export const showSignOutModal = () => {
  const docBody = document.querySelector("body");
  const modal = document.createElement("div");
  modal.classList.add("modal-wrapper");
  modal.setAttribute("id", "modal");

  modal.innerHTML = `
  <div class="modal">
    <h1>You are about to <strong>Sign out</strong></h1>
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
