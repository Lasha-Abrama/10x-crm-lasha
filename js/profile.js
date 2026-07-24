const profileDetails = document.querySelector("#profile-details");
const profileNameElement = document.querySelector("#profile-name");
const profileEmailElement = document.querySelector("#profile-email");
const profileCreatedAtElement = document.querySelector("#profile-created-at");
const editProfileButton = document.querySelector("#edit-profile-button");
const editProfileForm = document.querySelector("#edit-profile-form");
const editProfileNameInput = document.querySelector("#edit-profile-name");
const editProfileEmailInput = document.querySelector("#edit-profile-email");
const profileNameError = document.querySelector("#profile-name-error");
const profileEmailError = document.querySelector("#profile-email-error");
const cancelProfileEditButton = document.querySelector(
  "#cancel-profile-edit-button"
);
const changePasswordForm = document.querySelector("#change-password-form");
const currentPasswordInput = document.querySelector("#current-password");
const newPasswordInput = document.querySelector("#new-password");
const confirmNewPasswordInput = document.querySelector(
  "#confirm-new-password"
);
const currentPasswordError = document.querySelector(
  "#current-password-error"
);
const newPasswordError = document.querySelector("#new-password-error");
const confirmNewPasswordError = document.querySelector(
  "#confirm-new-password-error"
);
const resetCrmDataButton = document.querySelector("#reset-crm-data-button");

function getCurrentSession() {
  const savedSession = localStorage.getItem("crm_session");

  if (!savedSession) {
    return null;
  }

  try {
    return JSON.parse(savedSession);
  } catch (error) {
    return null;
  }
}

function getUsers() {
  const savedUsers = localStorage.getItem("crm_users");

  if (!savedUsers) {
    return [];
  }

  try {
    const users = JSON.parse(savedUsers);

    return Array.isArray(users) ? users : [];
  } catch (error) {
    return [];
  }
}

function getCurrentUser() {
  const session = getCurrentSession();

  if (!session) {
    return null;
  }

  const users = getUsers();
  const currentUser = users.find(function (user) {
    return Number(user.id) === Number(session.userId);
  });

  return currentUser || null;
}

function displayProfile() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    localStorage.removeItem("crm_session");
    window.location.href = "index.html";
    return;
  }

  profileNameElement.textContent = currentUser.fullName;
  profileEmailElement.textContent = currentUser.email;
  profileCreatedAtElement.textContent = new Date(
    currentUser.createdAt
  ).toLocaleDateString();
}

function populateProfileForm(user) {
  editProfileNameInput.value = user.fullName;
  editProfileEmailInput.value = user.email;
}

function clearProfileErrors() {
  profileNameError.textContent = "";
  profileEmailError.textContent = "";
  editProfileNameInput.classList.remove("input-error");
  editProfileEmailInput.classList.remove("input-error");
}

function showProfileError(input, errorElement, message) {
  input.classList.add("input-error");
  errorElement.textContent = message;
}

function validateProfileForm() {
  let isValid = true;
  const fullName = editProfileNameInput.value.trim();
  const email = editProfileEmailInput.value.trim().toLowerCase();

  if (fullName.length < 3) {
    showProfileError(
      editProfileNameInput,
      profileNameError,
      "Full name must be at least 3 characters"
    );
    isValid = false;
  }

  const atPosition = email.indexOf("@");
  const dotAfterAt = email.indexOf(".", atPosition + 1);

  if (email === "" || atPosition === -1 || dotAfterAt === -1) {
    showProfileError(
      editProfileEmailInput,
      profileEmailError,
      "Please enter a valid email address"
    );
    isValid = false;
  }

  return isValid;
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

function clearPasswordErrors() {
  currentPasswordError.textContent = "";
  newPasswordError.textContent = "";
  confirmNewPasswordError.textContent = "";
  currentPasswordInput.classList.remove("input-error");
  newPasswordInput.classList.remove("input-error");
  confirmNewPasswordInput.classList.remove("input-error");
}

function showPasswordError(input, errorElement, message) {
  input.classList.add("input-error");
  errorElement.textContent = message;
}

async function resetCrmData() {
  const shouldReset = confirm(
    "Are you sure you want to reset all CRM client data?"
  );

  if (!shouldReset) {
    return;
  }

  resetCrmDataButton.disabled = true;
  resetCrmDataButton.textContent = "Resetting...";

  try {
    localStorage.removeItem("crm_clients");
    await fetchClientsFromApi();
    showMessage("CRM data reset successfully!", "success");
  } catch (error) {
    showMessage("Failed to reset CRM data", "error");
    console.error("Failed to reset CRM data:", error);
  } finally {
    resetCrmDataButton.disabled = false;
    resetCrmDataButton.textContent = "Reset CRM Data";
  }
}

editProfileButton.addEventListener("click", function () {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    displayProfile();
    return;
  }

  clearProfileErrors();
  populateProfileForm(currentUser);
  profileDetails.classList.add("hidden");
  editProfileForm.classList.remove("hidden");
});

cancelProfileEditButton.addEventListener("click", function () {
  clearProfileErrors();
  editProfileForm.classList.add("hidden");
  profileDetails.classList.remove("hidden");
});

editProfileForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearProfileErrors();

  if (!validateProfileForm()) {
    return;
  }

  const session = getCurrentSession();
  const users = getUsers();

  if (!session) {
    displayProfile();
    return;
  }

  const email = editProfileEmailInput.value.trim().toLowerCase();
  const emailExists = users.some(function (user) {
    const isCurrentUser = Number(user.id) === Number(session.userId);
    const savedEmail = (user.email || "").trim().toLowerCase();

    return !isCurrentUser && savedEmail === email;
  });

  if (emailExists) {
    showProfileError(
      editProfileEmailInput,
      profileEmailError,
      "An account with this email already exists"
    );
    return;
  }

  const currentUserIndex = users.findIndex(function (user) {
    return Number(user.id) === Number(session.userId);
  });

  if (currentUserIndex === -1) {
    displayProfile();
    return;
  }

  const fullName = editProfileNameInput.value.trim();

  users[currentUserIndex].fullName = fullName;
  users[currentUserIndex].email = email;

  localStorage.setItem("crm_users", JSON.stringify(users));

  session.fullName = fullName;
  session.email = email;
  localStorage.setItem("crm_session", JSON.stringify(session));

  displayProfile();
  editProfileForm.classList.add("hidden");
  profileDetails.classList.remove("hidden");
  clearProfileErrors();
  showMessage("Profile updated successfully!", "success");
});

changePasswordForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearPasswordErrors();

  const currentUser = getCurrentUser();

  if (!currentUser) {
    localStorage.removeItem("crm_session");
    window.location.href = "index.html";
    return;
  }

  let isValid = true;
  const currentPassword = currentPasswordInput.value;
  const newPassword = newPasswordInput.value;
  const confirmNewPassword = confirmNewPasswordInput.value;
  const containsLetter = /[a-zA-Z]/.test(newPassword);
  const containsNumber = /[0-9]/.test(newPassword);

  if (currentPassword !== currentUser.password) {
    showPasswordError(
      currentPasswordInput,
      currentPasswordError,
      "Current password is incorrect"
    );
    isValid = false;
  }

  if (
    newPassword.length < 8 ||
    !containsLetter ||
    !containsNumber
  ) {
    showPasswordError(
      newPasswordInput,
      newPasswordError,
      "Password must be at least 8 characters and contain a letter and a number"
    );
    isValid = false;
  } else if (newPassword === currentUser.password) {
    showPasswordError(
      newPasswordInput,
      newPasswordError,
      "New password must be different from the current one"
    );
    isValid = false;
  }

  if (confirmNewPassword !== newPassword) {
    showPasswordError(
      confirmNewPasswordInput,
      confirmNewPasswordError,
      "Passwords do not match"
    );
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const session = getCurrentSession();
  const users = getUsers();
  const currentUserIndex = users.findIndex(function (user) {
    return Number(user.id) === Number(session.userId);
  });

  if (currentUserIndex === -1) {
    localStorage.removeItem("crm_session");
    window.location.href = "index.html";
    return;
  }

  // Real applications must store hashed passwords securely on a server.
  users[currentUserIndex].password = newPassword;
  localStorage.setItem("crm_users", JSON.stringify(users));

  changePasswordForm.reset();
  clearPasswordErrors();
  showMessage("Password changed ✓", "success");
});

resetCrmDataButton.addEventListener("click", resetCrmData);

displayProfile();
