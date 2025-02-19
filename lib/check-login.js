export const isLoggedIn = () => {
  if (localStorage.getItem("stu") != null) {
    return true;
  } else {
    return false;
  }
};
