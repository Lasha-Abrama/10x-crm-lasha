const clientDetailsContent = document.querySelector("#client-details-content");
const clientNotFoundMessage = document.querySelector("#client-not-found");
const clientNameElement = document.querySelector("#client-name");
const clientEmailElement = document.querySelector("#client-email");
const clientCompanyElement = document.querySelector("#client-company");
const clientStatusElement = document.querySelector("#client-status");
const clientCreatedElement = document.querySelector("#client-created");

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

function displayClientDetails() {
  const client = getClientById();

  if (!client) {
    clientDetailsContent.classList.add("hidden");
    clientNotFoundMessage.classList.add("visible");
    return;
  }

  clientDetailsContent.classList.remove("hidden");
  clientNotFoundMessage.classList.remove("visible");
  clientNameElement.textContent = client.fullName;
  clientEmailElement.textContent = client.email;
  clientCompanyElement.textContent = client.company || "—";
  clientStatusElement.textContent = client.status;
  clientCreatedElement.textContent = new Date(
    client.createdAt
  ).toLocaleDateString();
}

displayClientDetails();
