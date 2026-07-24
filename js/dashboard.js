function getSession() {
  const savedSession = localStorage.getItem("crm_session");

  if (savedSession) {
    return JSON.parse(savedSession);
  }

  return null;
}

function getClients() {
  const savedClients = localStorage.getItem("crm_clients");

  if (savedClients) {
    return JSON.parse(savedClients);
  }

  return [];
}

function displayUserName() {
  const session = getSession();
  const userNameElement = document.querySelector("#user-name");

  if (session && session.fullName) {
    userNameElement.textContent = session.fullName;
  } else {
    userNameElement.textContent = "User";
  }
}

function displayCurrentDate() {
  const currentDateElement = document.querySelector("#current-date");
  const currentDate = new Date();
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  currentDateElement.textContent = currentDate.toLocaleDateString(
    undefined,
    dateOptions
  );
}

function displayClientStatistics() {
  const clients = getClients();
  const totalClients = clients.length;
  const activeClients = clients.filter(
    (client) => client.status === "Active"
  ).length;
  const leadClients = clients.filter(
    (client) => client.status === "Lead"
  ).length;
  const inactiveClients = clients.filter(
    (client) => client.status === "Inactive"
  ).length;

  const totalClientsElement = document.querySelector("#total-clients");
  const activeClientsElement = document.querySelector("#active-clients");
  const leadClientsElement = document.querySelector("#lead-clients");
  const inactiveClientsElement = document.querySelector("#inactive-clients");

  if (totalClientsElement) {
    totalClientsElement.textContent = totalClients;
  }

  if (activeClientsElement) {
    activeClientsElement.textContent = activeClients;
  }

  if (leadClientsElement) {
    leadClientsElement.textContent = leadClients;
  }

  if (inactiveClientsElement) {
    inactiveClientsElement.textContent = inactiveClients;
  }
}

displayUserName();
displayCurrentDate();
displayClientStatistics();
