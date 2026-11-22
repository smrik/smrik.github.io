const root = document.documentElement
const system = window.matchMedia("(prefers-color-scheme: dark)")

try {
  const previous = localStorage.getItem("theme")
  if (localStorage.getItem("patrik-theme") === null && (previous === "dark" || previous === "light")) {
    localStorage.setItem("patrik-theme", previous)
  }
} catch {
  // The color scheme still follows the browser when storage is unavailable.
}

// Quartz uses saved-theme for syntax highlighting, comments, and Mermaid.
function syncQuartzTheme() {
  const theme = root.dataset.theme === "dark" || (!root.dataset.theme && system.matches) ? "dark" : "light"
  if (root.getAttribute("saved-theme") === theme) return
  root.setAttribute("saved-theme", theme)
  document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }))
}

syncQuartzTheme()
system.addEventListener("change", syncQuartzTheme)
new MutationObserver(syncQuartzTheme).observe(root, { attributeFilter: ["data-theme"] })
