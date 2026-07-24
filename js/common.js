const logoutButton = document.getElementById("logout-button");
const themeToggleButton = document.getElementById("theme-toggle");
const brandMark = document.querySelector(".brand-mark");

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

let tenXSequence = "";
let tenXModeTimeout;

function showTenXMessage() {
  const toastContainer = document.querySelector(".toast-container");

  if (!toastContainer) {
    return;
  }

  const toast = document.createElement("div");

  toast.classList.add("toast", "toast-ten-x");
  toast.textContent = "10X MODE UNLOCKED — Momentum activated 🚀";
  toastContainer.appendChild(toast);

  setTimeout(function () {
    toast.remove();
  }, 4000);
}

function activateTenXMode() {
  document.documentElement.setAttribute("data-ten-x-mode", "true");
  showTenXMessage();
  clearTimeout(tenXModeTimeout);

  tenXModeTimeout = setTimeout(function () {
    document.documentElement.removeAttribute("data-ten-x-mode");
  }, 10000);
}

applyTheme(getSavedTheme());

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", toggleTheme);
}

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}

if (brandMark) {
  brandMark.title = "Hold Shift and click to unlock 10X Mode";

  brandMark.addEventListener("click", function (event) {
    if (!event.shiftKey) {
      return;
    }

    event.preventDefault();
    activateTenXMode();
  });
}

// Easter egg: type "10X" while focus is outside a form field.
document.addEventListener("keydown", function (event) {
  const isFormField = event.target.matches("input, textarea, select");

  if (isFormField || event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  tenXSequence = `${tenXSequence}${event.key.toLowerCase()}`.slice(-3);

  if (tenXSequence === "10x") {
    tenXSequence = "";
    activateTenXMode();
  }
});
