function getSession() {
  const savedSession = localStorage.getItem("crm_session");

  if (savedSession) {
    return JSON.parse(savedSession);
  }

  return null;
}

function requireAuth() {
  const session = getSession();

  if (!session) {
    window.location.href = "index.html";
  }
}

requireAuth();
