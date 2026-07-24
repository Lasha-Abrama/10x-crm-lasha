const loginForm = document.querySelector("form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const emailErrorElement = emailInput.parentElement.querySelector(".error-message");
const passwordErrorElement = passwordInput.parentElement.querySelector(".error-message");
const loginButton = document.querySelector(".btn-primary");

// The page uses JavaScript validation instead of browser validation.
loginForm.noValidate = true;
loginButton.type = "submit";

function getUsers() {
  const savedUsers = localStorage.getItem("crm_users");

  if (savedUsers) {
    return JSON.parse(savedUsers);
  }

  return [];
}

function showMessage(message, type) {
  const toastContainer = document.querySelector(".toast-container");
  const toast = document.createElement("div");

  toast.classList.add("toast");

  if (type === "success") {
    toast.classList.add("toast-success");
  } else {
    toast.classList.add("toast-error");
  }

  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(function () {
    toast.remove();
  }, 3000);
}

function clearErrors() {
  emailErrorElement.textContent = "";
  passwordErrorElement.textContent = "";
  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");
}

function showError(input, errorElement, message) {
  errorElement.textContent = message;
  input.classList.add("input-error");
}

function validateLoginForm() {
  let isValid = true;
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (email === "") {
    showError(emailInput, emailErrorElement, "Email is required.");
    isValid = false;
  } else {
    const atPosition = email.indexOf("@");
    const dotPosition = email.indexOf(".", atPosition + 1);

    if (atPosition === -1 || dotPosition === -1) {
      showError(emailInput, emailErrorElement, "Please enter a valid email address.");
      isValid = false;
    }
  }

  if (password === "") {
    showError(passwordInput, passwordErrorElement, "Password is required.");
    isValid = false;
  } else if (password.length < 8) {
    showError(
      passwordInput,
      passwordErrorElement,
      "Password must be at least 8 characters."
    );
    isValid = false;
  }

  return isValid;
}

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  if (!validateLoginForm()) {
    return;
  }

  const users = getUsers();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const matchedUser = users.find(function (user) {
    return user.email === email && user.password === password;
  });

  if (!matchedUser) {
    showError(passwordInput, passwordErrorElement, "Invalid email or password");
    emailInput.classList.add("input-error");
    return;
  }

  const session = {
    userId: matchedUser.id,
    fullName: matchedUser.fullName,
    email: matchedUser.email,
    loggedInAt: new Date().toISOString()
  };

  localStorage.setItem("crm_session", JSON.stringify(session));
  showMessage("Login successful!", "success");

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1500);
});
