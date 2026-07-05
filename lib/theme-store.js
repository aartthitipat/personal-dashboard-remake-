const listeners = new Set();

export function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

export function getServerSnapshot() {
  return false;
}

export function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function toggleTheme() {
  const next = !getSnapshot();
  document.documentElement.classList.toggle("dark", next);
  localStorage.setItem("theme", next ? "dark" : "light");
  listeners.forEach((listener) => listener());
}
