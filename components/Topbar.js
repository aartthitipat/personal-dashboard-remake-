import ThemeToggle from "./ThemeToggle";

export default function Topbar() {
  return (
    <header className="flex items-center gap-4 border-b border-outline-variant bg-surface-container-lowest px-6 py-3">
      <div className="relative flex-1 max-w-md">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="1.8"
          stroke="currentColor"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="search"
          placeholder="Search sessions, tasks, or finances..."
          className="w-full rounded-full border border-outline-variant bg-surface px-9 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" className="h-5 w-5">
            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path strokeLinecap="round" d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>
        <button
          aria-label="Profile"
          className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" className="h-5 w-5">
            <circle cx="12" cy="8" r="3.5" />
            <path strokeLinecap="round" d="M4.5 20a7.5 7.5 0 0115 0" />
          </svg>
        </button>
      </div>
    </header>
  );
}
