export const showLoading = (message) => {
  window.scrollTo({ top: 0 });
  const docBody = document.querySelector("body");
  const loadingWrapper = document.createElement("div");
  const spinner = document.createElement("video");
  const spinnerSource = document.createElement("source");
  const loadingMessage = document.createElement("h1");

  loadingWrapper.setAttribute("id", "loading-wrapper");
  loadingMessage.innerText = message;
  spinner.setAttribute("autoplay", true);
  spinner.setAttribute("loop", true);
  spinnerSource.src = "../assets/loading-spinner.webm";
  spinnerSource.type = "video/webm";

  spinner.appendChild(spinnerSource);
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
