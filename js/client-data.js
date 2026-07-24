async function fetchClientsFromApi() {
  const response = await fetch("https://dummyjson.com/users?limit=30");

  if (!response.ok) {
    throw new Error("Failed to fetch clients from the API");
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
      company: apiUser.company ? apiUser.company.name : "",
      status: "Lead",
      dealValue: 0,
      notes: [],
      createdAt: new Date().toISOString()
    };
  });

  localStorage.setItem("crm_clients", JSON.stringify(clients));

  return clients;
}
