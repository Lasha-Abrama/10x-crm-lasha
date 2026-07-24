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

    return clients;
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
        fullName: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
        email: (apiUser.email || "").trim().toLowerCase(),
        phone: apiUser.phone || "",
        company: apiUser.company ? apiUser.company.name : "",
        image: apiUser.image || "",
        status: "Lead",
        dealValue: 0,
        notes: [],
        createdAt: new Date().toISOString()
      };
    });

    localStorage.setItem("crm_clients", JSON.stringify(clients));

    return clients;
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    throw error;
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
