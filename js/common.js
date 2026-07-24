const logoutButton = document.getElementById("logout-button");
const themeToggleButton = document.getElementById("theme-toggle");
const brandMark = document.querySelector(".brand-mark");
const tenXModeStorageKey = "crm_ten_x_mode";

function getSavedTheme() {
  const savedTheme = localStorage.getItem("crm_theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  if (themeToggleButton) {
    const nextThemeName = theme === "light" ? "dark" : "light";

    themeToggleButton.textContent = theme === "light" ? "☾" : "☀";
    themeToggleButton.setAttribute(
      "aria-label",
      `Switch to ${nextThemeName} mode`
    );
    themeToggleButton.title = `Switch to ${nextThemeName} mode`;
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

function showTenXMessage(message) {
  const toastContainer = document.querySelector(".toast-container");

  if (!toastContainer) {
    return;
  }

  const toast = document.createElement("div");

  toast.classList.add("toast", "toast-ten-x");
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(function () {
    toast.remove();
  }, 4000);
}

function getSavedTenXMode() {
  return localStorage.getItem(tenXModeStorageKey) === "true";
}

function applyTenXMode(isActive) {
  if (isActive) {
    document.documentElement.setAttribute("data-ten-x-mode", "true");
  } else {
    document.documentElement.removeAttribute("data-ten-x-mode");
  }

  if (brandMark) {
    brandMark.title = isActive
      ? "Hold Shift and click to turn off 10X Mode"
      : "Hold Shift and click to turn on 10X Mode";
  }
}

function toggleTenXMode() {
  const isActive =
    document.documentElement.getAttribute("data-ten-x-mode") === "true";
  const newMode = !isActive;

  localStorage.setItem(tenXModeStorageKey, String(newMode));
  applyTenXMode(newMode);
  showTenXMessage(
    newMode
      ? "10X MODE ON — Momentum activated 🚀"
      : "10X MODE OFF — Back to regular colors"
  );
}

applyTheme(getSavedTheme());
applyTenXMode(getSavedTenXMode());

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", toggleTheme);
}

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}

if (brandMark) {
  brandMark.addEventListener("click", function (event) {
    if (!event.shiftKey) {
      return;
    }

    event.preventDefault();
    toggleTenXMode();
  });
}
