const logoutButton = document.getElementById("logout-button");
const themeToggleButton = document.getElementById("theme-toggle");

function getSavedTheme() {
  const savedTheme = localStorage.getItem("crm_theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  if (themeToggleButton) {
    themeToggleButton.textContent = theme === "light" ? "Dark Mode" : "Light Mode";
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  localStorage.setItem("crm_theme", newTheme);
  applyTheme(newTheme);
}

function logout() {
  localStorage.removeItem("crm_session");
  window.location.href = "index.html";
}

applyTheme(getSavedTheme());

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", toggleTheme);
}

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}
