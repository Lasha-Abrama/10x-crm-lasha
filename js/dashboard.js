function getSession() {
  const savedSession = localStorage.getItem("crm_session");

  if (savedSession) {
    return JSON.parse(savedSession);
  }

  return null;
}

const statsGrid = document.querySelector(".stats-grid");
const dashboardClientState = document.querySelector("#dashboard-client-state");

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

function displayClientStatistics(clients) {
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

function showDashboardLoading() {
  statsGrid.classList.add("hidden");
  dashboardClientState.textContent = "Loading clients...";
  dashboardClientState.classList.remove("hidden");
}

function showDashboardError() {
  dashboardClientState.textContent = "";
  dashboardClientState.classList.remove("hidden");
  statsGrid.classList.add("hidden");

  const errorMessage = document.createElement("p");
  const retryButton = document.createElement("button");

  errorMessage.textContent = "Could not load client statistics.";
  retryButton.type = "button";
  retryButton.classList.add("btn", "btn-primary");
  retryButton.textContent = "Retry";
  retryButton.addEventListener("click", function () {
    loadClientStatistics(true);
  });

  dashboardClientState.appendChild(errorMessage);
  dashboardClientState.appendChild(retryButton);
}

async function loadClientStatistics(forceFreshRequest) {
  showDashboardLoading();

  try {
    const clients = forceFreshRequest
      ? await fetchClientsFromApi()
      : await loadClients();

    dashboardClientState.textContent = "";
    dashboardClientState.classList.add("hidden");
    statsGrid.classList.remove("hidden");
    displayClientStatistics(clients);
  } catch (error) {
    console.error("Could not load client statistics:", error);
    showDashboardError();
  }
}

displayUserName();
displayCurrentDate();
loadClientStatistics(false);
