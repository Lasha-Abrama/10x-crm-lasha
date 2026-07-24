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

displayProfile();
