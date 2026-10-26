import { useTheme } from "./themeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v2m0 14v2M3 12h2m14 0h2m-2.64-6.36-1.41 1.41M7.05 16.95l-1.41 1.41m0-12.72 1.41 1.41m9.9 9.9 1.41 1.41M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.7 15.4A8 8 0 0 1 8.6 3.3 8 8 0 1 0 20.7 15.4Z" />
        </svg>
      )}
      <span className="hidden lg:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

export default ThemeToggle;
