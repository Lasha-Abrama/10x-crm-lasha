const signupForm = document.querySelector("form");
const fullNameInput = document.querySelector("#full-name");
const emailInput = document.querySelector("#email");
const companyInput = document.querySelector("#company");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const createAccountButton = document.querySelector(".btn-primary");

// The page now uses JavaScript validation instead of browser validation.
signupForm.noValidate = true;
createAccountButton.type = "submit";

function getUsers() {
  const savedUsers = localStorage.getItem("crm_users");

  if (savedUsers) {
    return JSON.parse(savedUsers);
  }

  return [];
}

function saveUsers(users) {
  localStorage.setItem("crm_users", JSON.stringify(users));
}

function clearErrors() {
  const errorMessages = document.querySelectorAll(".error-message");
  const formInputs = document.querySelectorAll(".form-input");

  errorMessages.forEach(function (errorMessage) {
    errorMessage.textContent = "";
  });

  formInputs.forEach(function (input) {
    input.classList.remove("input-error");
  });
}

function showError(input, message) {
  const errorMessage = input.parentElement.querySelector(".error-message");

  errorMessage.textContent = message;
  input.classList.add("input-error");
}

function validateForm() {
  let isValid = true;
  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (fullName === "") {
    showError(fullNameInput, "Full name is required.");
    isValid = false;
  } else if (fullName.length < 3) {
    showError(fullNameInput, "Full name must be at least 3 characters.");
    isValid = false;
  }

  if (email === "") {
    showError(emailInput, "Email is required.");
    isValid = false;
  } else {
    const atPosition = email.indexOf("@");
    const dotPosition = email.indexOf(".", atPosition + 1);

    if (atPosition === -1 || dotPosition === -1) {
      showError(emailInput, "Please enter a valid email address.");
      isValid = false;
    }
  }

  if (password.length < 8) {
    showError(passwordInput, "Password must be at least 8 characters.");
    isValid = false;
  } else if (!/[a-z]/i.test(password)) {
    showError(passwordInput, "Password must contain at least one letter.");
    isValid = false;
  } else if (!/[0-9]/.test(password)) {
    showError(passwordInput, "Password must contain at least one number.");
    isValid = false;
  }

  if (confirmPassword !== password) {
    showError(confirmPasswordInput, "Passwords do not match.");
    isValid = false;
  }

  return isValid;
}

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  if (!validateForm()) {
    return;
  }

  const users = getUsers();
  const email = emailInput.value.trim().toLowerCase();
  const emailAlreadyExists = users.some(function (user) {
    return user.email.toLowerCase() === email;
  });

  if (emailAlreadyExists) {
    showError(emailInput, "An account with this email already exists");
    return;
  }

  const newUser = {
    id: Date.now(),
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim().toLowerCase(),
    password: passwordInput.value,
    company: companyInput.value.trim(),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  console.log("User saved successfully");
  signupForm.reset();
});
