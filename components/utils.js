import { MONTHS, HOLIDAYS, LS_KEY } from "./constants";

// ─── Date Key Helpers ─────────────────────────────────────────────────────

/** Creates a sortable ISO-style key: "YYYY-MM-DD" */
export const toKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

/** Formats a key like "2025-04-07" → "Apr 7, 2025" */
export const fmt = (key) => {
  if (!key) return "";
  const [y, m, d] = key.split("-");
  return `${MONTHS[parseInt(m) - 1].slice(0, 3)} ${parseInt(d)}, ${y}`;
};

/** Short format: "Apr 7" */
export const fmtShort = (key) => {
  if (!key) return "";
  const [, m, d] = key.split("-");
  return `${MONTHS[parseInt(m) - 1].slice(0, 3)} ${parseInt(d)}`;
};

/** Returns holiday label for a given month (0-indexed) + day, or null */
export const getHoliday = (month, day) =>
  HOLIDAYS[`${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`] ?? null;

// ─── Notes Persistence (localStorage) ────────────────────────────────────

export const loadNotes = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const persistNotes = (notes) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(notes));
  } catch {
    // Silently fail (e.g. private browsing quota exceeded)
  }
};

// ─── Calendar Grid Builder ────────────────────────────────────────────────

/**
 * Returns an array of cells for the month grid.
 * Leading nulls fill empty days before the 1st.
 * Trailing nulls pad to a full last week.
 */
export const buildCells = (year, month) => {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

// ─── Month Progress ───────────────────────────────────────────────────────

/**
 * Returns 0–1 representing how far through the given month today is.
 * Returns 1 for past months, 0 for future months.
 */
export const getMonthProgress = (year, month) => {
  const now = new Date();
  const nowY = now.getFullYear();
  const nowM = now.getMonth();
  const nowD = now.getDate();

  if (year === nowY && month === nowM) {
    return nowD / new Date(year, month + 1, 0).getDate();
  }
  if (year < nowY || (year === nowY && month < nowM)) return 1;
  return 0;
};
