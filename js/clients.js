const clientsTable = document.querySelector(".clients-table");
const clientsTableBody = document.querySelector("#clients-table-body");
const clientsEmptyMessage = document.querySelector("#clients-empty-message");
const clientsLoadState = document.querySelector("#clients-load-state");
const clientSearchInput = document.getElementById("client-search");
const statusFilter = document.getElementById("status-filter");
const sortClientsSelect = document.getElementById("sort-clients");
const addClientButton = document.getElementById("add-client-button");
const addClientModal = document.getElementById("add-client-modal");
const closeClientModalButton = document.getElementById("close-client-modal");
const cancelAddClientButton = document.getElementById("cancel-add-client");
const addClientForm = document.getElementById("add-client-form");
const newClientNameInput = document.getElementById("new-client-name");
const newClientEmailInput = document.getElementById("new-client-email");
const newClientCompanyInput = document.getElementById("new-client-company");
const newClientStatusInput = document.getElementById("new-client-status");
const newClientDealValueInput = document.getElementById(
  "new-client-deal-value"
);
const newClientNameError = document.getElementById("new-client-name-error");
const newClientEmailError = document.getElementById("new-client-email-error");
const newClientStatusError = document.getElementById(
  "new-client-status-error"
);
const newClientDealValueError = document.getElementById(
  "new-client-deal-value-error"
);
const validClientStatuses = ["Lead", "Contacted", "Won", "Lost"];
const clients = [];
let clientsReady = false;

function showClientsLoading() {
  clientsReady = false;
  clientsTableBody.textContent = "";
  clientsTable.classList.add("hidden");
  clientsEmptyMessage.classList.remove("visible");
  clientsLoadState.textContent = "";
  clientsLoadState.classList.remove("hidden");
  addClientButton.disabled = true;

  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Loading clients...";
  clientsLoadState.appendChild(loadingMessage);
}

function showClientsError() {
  clientsReady = false;
  clients.length = 0;
  clientsTableBody.textContent = "";
  clientsTable.classList.add("hidden");
  clientsEmptyMessage.classList.remove("visible");
  clientsLoadState.textContent = "";
  clientsLoadState.classList.remove("hidden");
  addClientButton.disabled = true;

  const errorMessage = document.createElement("p");
  const retryButton = document.createElement("button");

  errorMessage.textContent =
    "Could not load clients. Check your connection and try again.";
  retryButton.type = "button";
  retryButton.id = "retry-clients-button";
  retryButton.classList.add("btn", "btn-primary");
  retryButton.textContent = "Retry";
  retryButton.addEventListener("click", function () {
    loadClientsPage(true);
  });

  clientsLoadState.appendChild(errorMessage);
  clientsLoadState.appendChild(retryButton);
}

async function loadClientsPage(forceFreshRequest) {
  showClientsLoading();

  try {
    const loadedClients = forceFreshRequest
      ? await fetchClientsFromApi()
      : await loadClients();

    clients.length = 0;

    loadedClients.forEach(function (client) {
      clients.push(client);
    });

    clientsReady = true;
    clientsLoadState.textContent = "";
    clientsLoadState.classList.add("hidden");
    addClientButton.disabled = false;
    applyClientFilters();
  } catch (error) {
    console.error("Could not load clients:", error);
    showClientsError();
  }
}

function clearAddClientErrors() {
  const formFields = addClientForm.querySelectorAll(
    ".form-input, .form-select"
  );
  const errorMessages = addClientForm.querySelectorAll(".error-message");

  formFields.forEach(function (field) {
    field.classList.remove("input-error");
  });

  errorMessages.forEach(function (errorMessage) {
    errorMessage.textContent = "";
  });
}

function showAddClientError(input, errorElement, message) {
  input.classList.add("input-error");
  errorElement.textContent = message;
}

function openAddClientModal() {
  addClientForm.reset();
  clearAddClientErrors();
  addClientModal.classList.remove("hidden");
  newClientNameInput.focus();
}

function closeAddClientModal() {
  addClientModal.classList.add("hidden");
  addClientForm.reset();
  clearAddClientErrors();
}

function validateAddClientForm() {
  let isValid = true;
  const fullName = newClientNameInput.value.trim();
  const email = newClientEmailInput.value.trim().toLowerCase();
  const status = newClientStatusInput.value;
  const dealValueText = newClientDealValueInput.value.trim();

  if (fullName.length < 3) {
    showAddClientError(
      newClientNameInput,
      newClientNameError,
      "Full name must be at least 3 characters"
    );
    isValid = false;
  }

  const atPosition = email.indexOf("@");
  const dotAfterAt = email.indexOf(".", atPosition + 1);

  if (email === "" || atPosition === -1 || dotAfterAt === -1) {
    showAddClientError(
      newClientEmailInput,
      newClientEmailError,
      "Please enter a valid email address"
    );
    isValid = false;
  }

  if (!validClientStatuses.includes(status)) {
    showAddClientError(
      newClientStatusInput,
      newClientStatusError,
      "Please select a valid status"
    );
    isValid = false;
  }

  if (dealValueText !== "") {
    const dealValue = Number(dealValueText);

    if (Number.isNaN(dealValue) || dealValue < 0) {
      showAddClientError(
        newClientDealValueInput,
        newClientDealValueError,
        "Deal value must be 0 or greater"
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

function renderClients(clients) {
  clientsTableBody.innerHTML = "";

  if (clients.length === 0) {
    clientsTable.classList.add("hidden");
    clientsEmptyMessage.classList.add("visible");
    return;
  }

  clientsTable.classList.remove("hidden");
  clientsEmptyMessage.classList.remove("visible");

  clients.forEach(function (client) {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const emailCell = document.createElement("td");
    const companyCell = document.createElement("td");
    const statusCell = document.createElement("td");
    const createdCell = document.createElement("td");
    const actionsCell = document.createElement("td");
    const statusBadge = document.createElement("span");
    const viewButton = document.createElement("button");

    nameCell.textContent = client.fullName;
    emailCell.textContent = client.email;
    companyCell.textContent = client.company || "—";
    createdCell.textContent = new Date(client.createdAt).toLocaleDateString();

    statusBadge.classList.add("status-badge");
    statusBadge.textContent = client.status;

    if (client.status === "Lead") {
      statusBadge.classList.add("status-lead");
    } else if (client.status === "Contacted") {
      statusBadge.classList.add("status-contacted");
    } else if (client.status === "Won") {
      statusBadge.classList.add("status-won");
    } else if (client.status === "Lost") {
      statusBadge.classList.add("status-lost");
    }

    statusCell.appendChild(statusBadge);

    viewButton.type = "button";
    viewButton.classList.add("btn", "btn-secondary", "view-client-button");
    viewButton.textContent = "View";
    viewButton.dataset.clientId = client.id;
    actionsCell.appendChild(viewButton);

    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(companyCell);
    row.appendChild(statusCell);
    row.appendChild(createdCell);
    row.appendChild(actionsCell);
    clientsTableBody.appendChild(row);
  });

  const viewButtons = document.querySelectorAll(".view-client-button");

  viewButtons.forEach(function (viewButton) {
    viewButton.addEventListener("click", function () {
      const clientId = viewButton.dataset.clientId;

      window.location.href = `client-details.html?id=${clientId}`;
    });
  });
}

function applyClientFilters() {
  if (!clientsReady) {
    return;
  }

  const searchText = clientSearchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const selectedSort = sortClientsSelect.value;
  const filteredClients = clients.filter(function (client) {
    const fullName = (client.fullName || "").toLowerCase();
    const email = (client.email || "").toLowerCase();
    const company = (client.company || "").toLowerCase();
    const matchesSearch =
      fullName.startsWith(searchText) ||
      email.startsWith(searchText) ||
      company.startsWith(searchText);
    const matchesStatus =
      selectedStatus === "all" || client.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedClients = [...filteredClients];

  if (selectedSort === "newest") {
    sortedClients.sort(function (firstClient, secondClient) {
      const firstDate = new Date(firstClient.createdAt).getTime() || 0;
      const secondDate = new Date(secondClient.createdAt).getTime() || 0;

      return secondDate - firstDate;
    });
  } else if (selectedSort === "oldest") {
    sortedClients.sort(function (firstClient, secondClient) {
      const firstDate = new Date(firstClient.createdAt).getTime() || 0;
      const secondDate = new Date(secondClient.createdAt).getTime() || 0;

      return firstDate - secondDate;
    });
  } else if (selectedSort === "name-asc") {
    sortedClients.sort(function (firstClient, secondClient) {
      const firstName = firstClient.fullName || "";
      const secondName = secondClient.fullName || "";

      return firstName.localeCompare(secondName);
    });
  } else if (selectedSort === "name-desc") {
    sortedClients.sort(function (firstClient, secondClient) {
      const firstName = firstClient.fullName || "";
      const secondName = secondClient.fullName || "";

      return secondName.localeCompare(firstName);
    });
  }

  renderClients(sortedClients);
}

if (clientSearchInput && statusFilter && sortClientsSelect) {
  clientSearchInput.addEventListener("input", applyClientFilters);
  statusFilter.addEventListener("change", applyClientFilters);
  sortClientsSelect.addEventListener("change", applyClientFilters);
}

addClientButton.addEventListener("click", openAddClientModal);
closeClientModalButton.addEventListener("click", closeAddClientModal);
cancelAddClientButton.addEventListener("click", closeAddClientModal);

addClientForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearAddClientErrors();

  if (!validateAddClientForm()) {
    return;
  }

  const currentClients = getStoredClients() || [];
  const email = newClientEmailInput.value.trim().toLowerCase();
  const emailExists = currentClients.some(function (client) {
    const savedEmail = (client.email || "").trim().toLowerCase();

    return savedEmail === email;
  });

  if (emailExists) {
    showAddClientError(
      newClientEmailInput,
      newClientEmailError,
      "A client with this email already exists"
    );
    return;
  }

  const newClient = {
    id: Date.now(),
    fullName: newClientNameInput.value.trim(),
    email: newClientEmailInput.value.trim().toLowerCase(),
    company: newClientCompanyInput.value.trim(),
    status: newClientStatusInput.value,
    dealValue: newClientDealValueInput.value
      ? Number(newClientDealValueInput.value)
      : 0,
    notes: [],
    createdAt: new Date().toISOString()
  };

  clients.length = 0;

  currentClients.forEach(function (client) {
    clients.push(client);
  });

  clients.push(newClient);
  localStorage.setItem("crm_clients", JSON.stringify(clients));

  closeAddClientModal();
  applyClientFilters();
  showMessage("Client added successfully!", "success");
});

loadClientsPage(false);
