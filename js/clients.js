const clientsTable = document.querySelector(".clients-table");
const clientsTableBody = document.querySelector("#clients-table-body");
const clientsEmptyMessage = document.querySelector("#clients-empty-message");
const clientSearchInput = document.getElementById("client-search");
const statusFilter = document.getElementById("status-filter");
const sortClientsSelect = document.getElementById("sort-clients");

function getClients() {
  const savedClients = localStorage.getItem("crm_clients");

  if (savedClients) {
    return JSON.parse(savedClients);
  }

  return [];
}

const clients = getClients();

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

    if (client.status === "Active") {
      statusBadge.classList.add("status-active");
    } else if (client.status === "Lead") {
      statusBadge.classList.add("status-lead");
    } else if (client.status === "Inactive") {
      statusBadge.classList.add("status-inactive");
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
}

function applyClientFilters() {
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

applyClientFilters();
