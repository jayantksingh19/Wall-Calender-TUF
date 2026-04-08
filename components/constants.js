// ─── Month Names & Day Labels ──────────────────────────────────────────────
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Per-Month Color Themes ────────────────────────────────────────────────
// Each month has: accent (primary), light (range highlight), dark (overlay for hero)
export const MONTH_THEME = [
  { accent: "#2563eb", light: "#dbeafe", dark: "#1e3a8a" },
  { accent: "#db2777", light: "#fce7f3", dark: "#831843" },
  { accent: "#059669", light: "#d1fae5", dark: "#064e3b" },
  { accent: "#7c3aed", light: "#ede9fe", dark: "#4c1d95" },
  { accent: "#0891b2", light: "#cffafe", dark: "#164e63" },
  { accent: "#0369a1", light: "#e0f2fe", dark: "#0c4a6e" },
  { accent: "#d97706", light: "#fef3c7", dark: "#78350f" },
  { accent: "#dc2626", light: "#fee2e2", dark: "#7f1d1d" },
  { accent: "#b45309", light: "#fef3c7", dark: "#78350f" },
  { accent: "#c2410c", light: "#ffedd5", dark: "#7c2d12" },
  { accent: "#475569", light: "#e2e8f0", dark: "#1e293b" },
  { accent: "#1e40af", light: "#dbeafe", dark: "#1e3a8a" },
];

// ─── Hero Images (Unsplash, one per month) ────────────────────────────────
export const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490750967868-88df5691bbfd?w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1467220822224-72ed97fd27b6?w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1400&auto=format&fit=crop",
];

// ─── Public Holidays ──────────────────────────────────────────────────────
// Key format: "MM-DD"
export const HOLIDAYS = {
  "01-01": "New Year's Day 🎆",
  "01-15": "MLK Jr. Day 🕊️",
  "02-14": "Valentine's Day 💝",
  "03-17": "St. Patrick's Day 🍀",
  "04-22": "Earth Day 🌍",
  "05-05": "Cinco de Mayo 🎊",
  "06-19": "Juneteenth 🌟",
  "07-04": "Independence Day 🎇",
  "10-31": "Halloween 🎃",
  "11-11": "Veterans Day 🎖️",
  "12-24": "Christmas Eve 🎁",
  "12-25": "Christmas Day 🎄",
  "12-31": "New Year's Eve 🥂",
};

// ─── localStorage Key ─────────────────────────────────────────────────────
export const LS_KEY = "wc_notes_v2";
