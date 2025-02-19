const checkFormValidity = (form) => {
  if (!form.checkValidity()) {
    let tmpSubmit = document.createElement("button");
    form.appendChild(tmpSubmit);
    tmpSubmit.click();
    form.removeChild(tmpSubmit);
    return false;
  } else {
    return true;
  }
};

export default checkFormValidity;
