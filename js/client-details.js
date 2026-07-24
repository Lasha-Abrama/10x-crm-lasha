const clientDetailsContent = document.querySelector("#client-details-content");
const clientNotFoundMessage = document.querySelector("#client-not-found");
const clientNameElement = document.querySelector("#client-name");
const clientEmailElement = document.querySelector("#client-email");
const clientCompanyElement = document.querySelector("#client-company");
const clientStatusElement = document.querySelector("#client-status");
const clientCreatedElement = document.querySelector("#client-created");
const editClientButton = document.querySelector("#edit-client-button");
const editClientForm = document.querySelector("#edit-client-form");
const cancelEditButton = document.querySelector("#cancel-edit-button");
const editClientNameInput = document.querySelector("#edit-client-name");
const editClientEmailInput = document.querySelector("#edit-client-email");
const editClientCompanyInput = document.querySelector("#edit-client-company");
const editClientStatusInput = document.querySelector("#edit-client-status");
const editClientDealValueInput = document.querySelector(
  "#edit-client-deal-value"
);
const validStatuses = ["Lead", "Contacted", "Won", "Lost"];

function getClientIdFromUrl() {
  const urlParameters = new URLSearchParams(window.location.search);

  return urlParameters.get("id");
}

function getClients() {
  const savedClients = localStorage.getItem("crm_clients");

  if (savedClients) {
    return JSON.parse(savedClients);
  }

  return [];
}

function getClientById() {
  const clientId = Number(getClientIdFromUrl());
  const clients = getClients();

  return clients.find(function (client) {
    return client.id === clientId;
  });
}

function populateEditForm(client) {
  editClientNameInput.value = client.fullName || "";
  editClientEmailInput.value = client.email || "";
  editClientCompanyInput.value = client.company || "";
  editClientStatusInput.value = client.status || "";

  if (client.dealValue === undefined || client.dealValue === null) {
    editClientDealValueInput.value = "";
  } else {
    editClientDealValueInput.value = client.dealValue;
  }
}

function clearEditErrors() {
  const errorMessages = editClientForm.querySelectorAll(".error-message");
  const formFields = editClientForm.querySelectorAll(
    ".form-input, .form-select"
  );

  errorMessages.forEach(function (errorMessage) {
    errorMessage.textContent = "";
  });

  formFields.forEach(function (field) {
    field.classList.remove("input-error");
  });
}

function showEditError(input, errorElement, message) {
  input.classList.add("input-error");
  errorElement.textContent = message;
}

function validateEditForm() {
  let isValid = true;
  const fullName = editClientNameInput.value.trim();
  const email = editClientEmailInput.value.trim().toLowerCase();
  const status = editClientStatusInput.value;
  const dealValueText = editClientDealValueInput.value.trim();
  const nameError = editClientNameInput.parentElement.querySelector(
    ".error-message"
  );
  const emailError = editClientEmailInput.parentElement.querySelector(
    ".error-message"
  );
  const statusError = editClientStatusInput.parentElement.querySelector(
    ".error-message"
  );
  const dealValueError = editClientDealValueInput.parentElement.querySelector(
    ".error-message"
  );

  if (fullName === "") {
    showEditError(
      editClientNameInput,
      nameError,
      "Full name is required."
    );
    isValid = false;
  } else if (fullName.length < 3) {
    showEditError(
      editClientNameInput,
      nameError,
      "Full name must be at least 3 characters."
    );
    isValid = false;
  }

  if (email === "") {
    showEditError(editClientEmailInput, emailError, "Email is required.");
    isValid = false;
  } else {
    const atPosition = email.indexOf("@");
    const dotAfterAt = email.indexOf(".", atPosition + 1);

    if (atPosition === -1 || dotAfterAt === -1) {
      showEditError(
        editClientEmailInput,
        emailError,
        "Please enter a valid email address."
      );
      isValid = false;
    }
  }

  if (status === "") {
    showEditError(editClientStatusInput, statusError, "Status is required.");
    isValid = false;
  } else if (!validStatuses.includes(status)) {
    showEditError(
      editClientStatusInput,
      statusError,
      "Please select a valid status."
    );
    isValid = false;
  }

  if (dealValueText !== "") {
    const dealValue = Number(dealValueText);

    if (Number.isNaN(dealValue)) {
      showEditError(
        editClientDealValueInput,
        dealValueError,
        "Deal value must be a number."
      );
      isValid = false;
    } else if (dealValue < 0) {
      showEditError(
        editClientDealValueInput,
        dealValueError,
        "Deal value cannot be negative."
      );
      isValid = false;
    }
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

function displayClientDetails() {
  const client = getClientById();

  if (!client) {
    clientDetailsContent.classList.add("hidden");
    editClientForm.classList.add("hidden");
    clientNotFoundMessage.classList.add("visible");
    return;
  }

  clientDetailsContent.classList.remove("hidden");
  editClientForm.classList.add("hidden");
  clientNotFoundMessage.classList.remove("visible");
  clientNameElement.textContent = client.fullName;
  clientEmailElement.textContent = client.email;
  clientCompanyElement.textContent = client.company || "—";
  clientStatusElement.textContent = client.status;
  clientCreatedElement.textContent = new Date(
    client.createdAt
  ).toLocaleDateString();
}

editClientButton.addEventListener("click", function () {
  const client = getClientById();

  if (!client) {
    displayClientDetails();
    return;
  }

  clearEditErrors();
  populateEditForm(client);
  clientDetailsContent.classList.add("hidden");
  editClientForm.classList.remove("hidden");
});

cancelEditButton.addEventListener("click", function () {
  clearEditErrors();
  displayClientDetails();
});

editClientForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearEditErrors();

  if (!validateEditForm()) {
    return;
  }

  const clients = getClients();
  const clientId = Number(getClientIdFromUrl());
  const clientIndex = clients.findIndex(function (client) {
    return client.id === clientId;
  });

  if (clientIndex === -1) {
    displayClientDetails();
    return;
  }

  const dealValueText = editClientDealValueInput.value.trim();

  clients[clientIndex].fullName = editClientNameInput.value.trim();
  clients[clientIndex].email = editClientEmailInput.value.trim().toLowerCase();
  clients[clientIndex].company = editClientCompanyInput.value.trim();
  clients[clientIndex].status = editClientStatusInput.value;
  clients[clientIndex].dealValue =
    dealValueText === "" ? "" : Number(dealValueText);

  localStorage.setItem("crm_clients", JSON.stringify(clients));

  displayClientDetails();
  showMessage("Client updated successfully!", "success");
});

displayClientDetails();
