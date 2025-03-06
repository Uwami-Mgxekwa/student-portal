export const showLoading = (message) => {
  window.scrollTo({ top: 0 });
  const docBody = document.querySelector("body");
  const loadingWrapper = document.createElement("div");
  const spinner = document.createElement("div");
  const loadingMessage = document.createElement("h1");

  loadingWrapper.setAttribute("id", "loading-wrapper");
  loadingMessage.innerText = message;
  spinner.classList.add("loader");

  loadingWrapper.appendChild(spinner);
  loadingWrapper.appendChild(loadingMessage);
  loadingWrapper.classList.add("loading-wrapper");
  docBody.appendChild(loadingWrapper);
};

export const removeLoading = () => {
  const docBody = document.querySelector("body");
  const loadingWrapper = document.getElementById("loading-wrapper");
  docBody.removeChild(loadingWrapper);
};

export const setLoading = (state) => {
  return state;
};
