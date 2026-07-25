function generateDealValue() {
  return Math.floor(Math.random() * 9001) + 1000;
}

function normalizeStoredClient(client, migrateLegacyDealValue) {
  const savedDealValue = Number(client.dealValue);
  const validStatuses = ["Lead", "Contacted", "Won", "Lost"];
  const isLegacyApiClient =
    migrateLegacyDealValue &&
    savedDealValue === 1000 &&
    typeof client.image === "string" &&
    client.image.includes("dummyjson.com");

  return {
    id: client.id,
    name: client.name || client.fullName || "",
    email: (client.email || "").trim().toLowerCase(),
    phone: client.phone || "",
    company: client.company || "",
    image: client.image || "",
    status: validStatuses.includes(client.status) ? client.status : "Lead",
    dealValue:
      savedDealValue > 0 && !isLegacyApiClient
        ? savedDealValue
        : generateDealValue(),
    notes: Array.isArray(client.notes) ? client.notes : [],
    createdAt: client.createdAt || new Date().toISOString(),
  };
}

function getStoredClients() {
  const savedClients = localStorage.getItem("crm_clients");

  if (savedClients === null) {
    return null;
  }

  try {
    const clients = JSON.parse(savedClients);

    if (!Array.isArray(clients)) {
      throw new Error("Stored client data is not an array");
    }

    const containsInvalidClient = clients.some(function (client) {
      return !client || typeof client !== "object";
    });

    if (containsInvalidClient) {
      throw new Error("Stored client data contains an invalid client");
    }

    const shouldMigrateDealValues =
      localStorage.getItem("crm_deal_values_migrated") !== "true";
    const normalizedClients = clients.map(function (client) {
      return normalizeStoredClient(client, shouldMigrateDealValues);
    });
    const normalizedClientsJson = JSON.stringify(normalizedClients);

    if (normalizedClientsJson !== savedClients) {
      localStorage.setItem("crm_clients", normalizedClientsJson);
    }

    if (shouldMigrateDealValues) {
      localStorage.setItem("crm_deal_values_migrated", "true");
    }

    return normalizedClients;
  } catch (error) {
    console.error("Failed to read stored clients:", error);
    localStorage.removeItem("crm_clients");
    return null;
  }
}

async function fetchClientsFromApi() {
  try {
    const response = await fetch("https://dummyjson.com/users?limit=30");

    if (!response.ok) {
      throw new Error("Failed to fetch clients");
    }

    const data = await response.json();

    if (!Array.isArray(data.users)) {
      throw new Error("The API returned invalid client data");
    }

    const clients = data.users.map(function (apiUser) {
      return {
        id: apiUser.id,
        name: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
        email: (apiUser.email || "").trim().toLowerCase(),
        phone: apiUser.phone || "",
        company: apiUser.company ? apiUser.company.name : "",
        image: apiUser.image || "",
        status: "Lead",
        dealValue: generateDealValue(),
        notes: [],
        createdAt: new Date().toISOString(),
      };
    });

    localStorage.setItem("crm_clients", JSON.stringify(clients));
    localStorage.setItem("crm_deal_values_migrated", "true");

    return clients;
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    throw error;
  }
}

async function createClientInApi(clientData) {
  const response = await fetch("https://dummyjson.com/users/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientData),
  });

  if (!response.ok) {
    throw new Error("Failed to create client");
  }

  return response.json();
}

async function deleteClientFromApi(clientId) {
  const response = await fetch(`https://dummyjson.com/users/${clientId}`, {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 404) {
    throw new Error("Failed to delete client");
  }
}

async function loadClients() {
  const storedClients = getStoredClients();

  if (storedClients !== null) {
    return storedClients;
  }

  try {
    return await fetchClientsFromApi();
  } catch (error) {
    console.error("Failed to load clients:", error);
    throw error;
  }
}
