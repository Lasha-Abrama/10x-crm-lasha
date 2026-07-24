const logoutButton = document.getElementById("logout-button");

function logout() {
  localStorage.removeItem("crm_session");
  window.location.href = "index.html";
}

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}
