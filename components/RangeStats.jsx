"use client";
/**
 * RangeStats
 *
 * Displays a small pill-shaped stats bar when a date range is active,
 * showing the number of days selected and any holidays within the range.
 *
 * Props:
 *   startDate  {string|null}  "YYYY-MM-DD"
 *   endDate    {string|null}  "YYYY-MM-DD"
 *   accent     {string}       month accent color
 *   light      {string}       month light color
 */
import { HOLIDAYS } from "./constants";

function countHolidaysInRange(startDate, endDate) {
  if (!startDate || !endDate) return [];
  const hits = [];
  const [sy, sm, sd] = startDate.split("-").map(Number);
  const [ey, em, ed] = endDate.split("-").map(Number);
  const start = new Date(sy, sm - 1, sd);
  const end   = new Date(ey, em - 1, ed);
  const cur   = new Date(start);
  while (cur <= end) {
    const key = `${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
    if (HOLIDAYS[key]) hits.push(HOLIDAYS[key]);
    cur.setDate(cur.getDate() + 1);
  }
  return hits;
}

function getDayCount(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const [sy, sm, sd] = startDate.split("-").map(Number);
  const [ey, em, ed] = endDate.split("-").map(Number);
  const diff = new Date(ey, em - 1, ed) - new Date(sy, sm - 1, sd);
  return Math.round(diff / 86_400_000) + 1;
}

export default function RangeStats({ startDate, endDate, accent, light, isDark }) {
  if (!startDate || !endDate) return null;

  const days     = getDayCount(startDate, endDate);
  const weeks    = (days / 7).toFixed(1);
  const holidays = countHolidaysInRange(startDate, endDate);

  const barBg     = isDark ? `${accent}18` : light;
  const barBorder = isDark ? `${accent}30` : `${accent}33`;
  const tagBg     = isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.7)";

  return (
    <div style={{ ...styles.bar, background: barBg, borderColor: barBorder }}>
      <Stat value={days}  label={days === 1 ? "day" : "days"}    accent={accent} isDark={isDark} />
      <div style={styles.divider} />
      <Stat value={weeks} label="weeks"                           accent={accent} isDark={isDark} />
      <div style={styles.divider} />
      <Stat value={holidays.length} label={holidays.length === 1 ? "holiday" : "holidays"} accent={accent} isDark={isDark} />
      {holidays.length > 0 && (
        <div style={styles.holidayList}>
          {holidays.map((h) => (
            <span key={h} style={{ ...styles.holidayTag, color: accent, background: tagBg }}>
              {h}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ value, label, accent, isDark }) {
  return (
    <div style={styles.stat}>
      <span style={{ ...styles.statVal, color: accent }}>{value}</span>
      <span style={{ ...styles.statLabel, color: isDark ? "#555" : "#aaa" }}>{label}</span>
    </div>
  );
}

const styles = {
  bar: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px 0",
    padding: "10px 16px",
    borderRadius: 12,
    border: "1px solid",
    marginTop: 10,
    transition: "background 0.3s, border-color 0.3s",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 14px",
    minWidth: 54,
  },
  statVal: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.1,
    fontFamily: "'Lora', serif",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#aaa",
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 28,
    background: "rgba(0,0,0,0.08)",
  },
  holidayList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    padding: "0 10px",
    flex: 1,
  },
  holidayTag: {
    fontSize: 10,
    background: "rgba(255,255,255,0.7)",
    padding: "2px 8px",
    borderRadius: 99,
    fontWeight: 500,
  },
};
