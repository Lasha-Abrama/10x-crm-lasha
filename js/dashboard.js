function getSession() {
  const savedSession = localStorage.getItem("crm_session");

  if (savedSession) {
    return JSON.parse(savedSession);
  }

  return null;
}

function displayUserName() {
  const session = getSession();
  const userNameElement = document.querySelector("#user-name");

  if (session && session.fullName) {
    userNameElement.textContent = session.fullName;
  } else {
    userNameElement.textContent = "User";
  }
}

function displayCurrentDate() {
  const currentDateElement = document.querySelector("#current-date");
  const currentDate = new Date();
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  currentDateElement.textContent = currentDate.toLocaleDateString(
    undefined,
    dateOptions
  );
}

displayUserName();
displayCurrentDate();
