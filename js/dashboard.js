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
  const activeDeals = clients.filter((client) => {
    return client.status !== "Won" && client.status !== "Lost";
  }).length;
  const wonRevenue = clients
    .filter((client) => client.status === "Won")
    .reduce((total, client) => {
      return total + (Number(client.dealValue) || 0);
    }, 0);
  const newThisWeek = clients.filter((client) => {
    const daysSinceCreated =
      (Date.now() - new Date(client.createdAt).getTime()) / 86400000;

    return daysSinceCreated >= 0 && daysSinceCreated <= 7;
  }).length;

  const totalClientsElement = document.querySelector("#total-clients");
  const activeDealsElement = document.querySelector("#active-deals");
  const wonRevenueElement = document.querySelector("#won-revenue");
  const newThisWeekElement = document.querySelector("#new-this-week");

  if (totalClientsElement) {
    totalClientsElement.textContent = totalClients;
  }

  if (activeDealsElement) {
    activeDealsElement.textContent = activeDeals;
  }

  if (wonRevenueElement) {
    wonRevenueElement.textContent = `$${wonRevenue.toLocaleString()}`;
  }

  if (newThisWeekElement) {
    newThisWeekElement.textContent = newThisWeek;
  }
}

async function loadClientStatistics() {
  if (localStorage.getItem("crm_clients") === null) {
    try {
      await fetchClientsFromApi();
    } catch (error) {
      console.error("Failed to load client statistics:", error);
    }
  }

  displayClientStatistics();
}

displayUserName();
displayCurrentDate();
loadClientStatistics();
