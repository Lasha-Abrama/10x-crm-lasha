const loginForm = document.querySelector("form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const emailErrorElement =
  emailInput.parentElement.querySelector(".error-message");
const passwordErrorElement =
  passwordInput.parentElement.querySelector(".error-message");

// The page uses JavaScript validation instead of browser validation.
loginForm.noValidate = true;

function getUsers() {
  const savedUsers = localStorage.getItem("crm_users");

  if (!savedUsers) {
    return [];
  }

  try {
    const users = JSON.parse(savedUsers);

    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error("Failed to read users:", error);
    return [];
  }
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
    showError(emailInput, emailErrorElement, "Email is required");
    isValid = false;
  }

  if (password === "") {
    showError(passwordInput, passwordErrorElement, "Password is required");
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
    loginAt: new Date().toISOString(),
  };

  localStorage.setItem("crm_session", JSON.stringify(session));
  window.location.href = "dashboard.html";
});
