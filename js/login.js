const loginForm = document.querySelector("form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const emailErrorElement = emailInput.parentElement.querySelector(".error-message");
const passwordErrorElement = passwordInput.parentElement.querySelector(".error-message");
const loginButton = document.querySelector(".btn-primary");

// The page uses JavaScript validation instead of browser validation.
loginForm.noValidate = true;
loginButton.type = "submit";

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

  if (validateLoginForm()) {
    console.log("Login validation passed");
  }
});
