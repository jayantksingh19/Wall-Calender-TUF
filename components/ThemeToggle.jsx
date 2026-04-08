"use client";
/**
 * ThemeToggle
 *
 * Plain <button> with onClick — works on every device.
 * No CSS class overrides; all styles are inline so dark/light
 * state is always reflected accurately.
 */
export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 16px",
        borderRadius: 99,
        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        background: isDark ? "rgba(50,50,55,0.9)" : "rgba(255,255,255,0.8)",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "'Manrope', sans-serif",
        color: isDark ? "#aaa" : "#555",
        letterSpacing: 0.5,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        // Instant tap on mobile — no 300ms delay
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        transition: "background 0.25s, color 0.25s, border-color 0.25s",
        userSelect: "none",
      }}
    >
      <span style={{ fontSize: 14 }}>{isDark ? "☀️" : "🌙"}</span>
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
