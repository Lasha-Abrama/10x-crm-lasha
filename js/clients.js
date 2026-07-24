const clientsTable = document.querySelector(".clients-table");
const clientsTableBody = document.querySelector("#clients-table-body");
const clientsEmptyMessage = document.querySelector("#clients-empty-message");
const clientSearchInput = document.getElementById("client-search");

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

function filterClientsBySearch() {
  const searchText = clientSearchInput.value.trim().toLowerCase();
  const filteredClients = clients.filter(function (client) {
    const fullName = client.fullName.toLowerCase();
    const email = client.email.toLowerCase();
    const company = client.company || "";

    return (
      fullName.includes(searchText) ||
      email.includes(searchText) ||
      company.toLowerCase().includes(searchText)
    );
  });

  renderClients(filteredClients);
}

if (clientSearchInput) {
  clientSearchInput.addEventListener("input", filterClientsBySearch);
}

renderClients(clients);
