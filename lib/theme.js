export const switchTheme = (currentTheme) => {
  const htmlTag = document.querySelector("html");
  if (currentTheme == "light") {
    htmlTag.setAttribute("data-theme", "dark");
  } else {
    htmlTag.setAttribute("data-theme", "light");
  }
};

export const setTheme = (theme) => {
  const htmlTag = document.querySelector("html");
  htmlTag.setAttribute("data-theme", theme);
};

export const saveTheme = (theme) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("theme", theme);
  } else if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("theme", theme);
  }
};
