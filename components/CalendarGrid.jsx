"use client";
import { useMemo } from "react";
import { DAYS, MONTHS } from "./constants";
import { toKey, buildCells } from "./utils";
import RangeStats from "./RangeStats";

// ─── Day Headers ───────────────────────────────────────────────────────────
function DayHeaders({ accent, isDark }) {
  return (
    <div style={styles.headerRow}>
      {DAYS.map((d, i) => (
        <div
          key={d}
          style={{
            ...styles.headerCell,
            color: (i === 0 || i === 6) ? accent : (isDark ? "#555" : "#bbb"),
          }}
        >
          {d}
        </div>
      ))}
    </div>
  );
}

// ─── Single Day Cell ───────────────────────────────────────────────────────
function DayCell({ day, variant, accent, light, isWeekend, holiday, month, year, onHolidayEnter, onHolidayLeave, onClick, isDark }) {
  if (!day) return <div style={styles.emptyCell} />;

  const isStart  = variant === "start";
  const isEnd    = variant === "end";
  const inRange  = variant === "inRange";
  const isToday  = variant === "today";

  // ── The single wrapper does everything: range bg + circle + click ──────
  // By putting onClick on the outermost element we avoid any z-index
  // stacking issue where an absolutely-positioned child intercepts the tap.
  return (
    <div
      className="wc-day-cell"
      style={{
        ...styles.cellOuter,
        backgroundImage: isStart
          ? `linear-gradient(to right, transparent 50%, ${light} 50%)`
          : isEnd
          ? `linear-gradient(to left,  transparent 50%, ${light} 50%)`
          : (inRange ? undefined : undefined),
        background: inRange ? light : "transparent",
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${day} ${MONTHS[month]} ${year}${holiday ? `, ${holiday}` : ""}${isToday ? ", today" : ""}`}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div
        className={`wc-day-circle${isToday ? " wc-today" : ""}`}
        style={{
          ...styles.circle,
          ...(isStart || isEnd
            ? { background: accent, color: "#fff", fontWeight: 700, boxShadow: `0 3px 12px ${accent}55` }
            : inRange
            ? { background: "transparent", color: accent, fontWeight: 500, borderRadius: "0" }
            : isToday
            ? { border: `2px solid ${accent}`, color: accent, fontWeight: 700 }
            : {
                color: isWeekend ? accent : (isDark ? "#ccc" : "#3a3a3a"),
                border: "2px solid transparent",
              }
          ),
        }}
      >
        {day}
      </div>

      {holiday && (
        <span
          className="wc-holiday-dot"
          style={{
            background: (isStart || isEnd) ? "#fff" : accent,
            pointerEvents: "none",
          }}
          aria-label={holiday}
        />
      )}
    </div>
  );
}

// ─── Range Status Bar ──────────────────────────────────────────────────────
function RangeBar({ accent, step, rangeLabel, startDate, onClear, isDark }) {
  return (
    <div style={{
      ...styles.rangeBar,
      background: isDark ? "#2a2a2c" : "#f8f8f8",
      borderColor: startDate ? `${accent}44` : (isDark ? "#333" : "#eee"),
    }}>
      <span style={{
        fontSize: 11.5,
        color: step === 1 ? accent : (isDark ? "#555" : "#aaa"),
        fontWeight: step === 1 ? 600 : 400,
        letterSpacing: 0.2,
      }}>
        {step === 1 ? "📅 " : ""}{rangeLabel}
      </span>
      {startDate && (
        <button
          onClick={onClear}
          style={styles.clearBtn}
          aria-label="Clear selection"
        >
          Clear
        </button>
      )}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────
export default function CalendarGrid({
  month, year, accent, light,
  startDate, endDate, step, hoverDate,
  todayKey,
  onDayClick, onDayHover, onGridLeave,
  onHolidayEnter, onHolidayLeave,
  onClearSelection, rangeLabel,
  getHoliday, isDark, theme,
}) {
  const cells = useMemo(() => buildCells(year, month), [year, month]);

  const getVariant = (day) => {
    if (!day) return "empty";
    const key    = toKey(year, month, day);
    const effEnd = endDate ?? (step === 1 && hoverDate ? hoverDate : null);

    if (startDate && effEnd) {
      const lo = startDate < effEnd ? startDate : effEnd;
      const hi = startDate < effEnd ? effEnd   : startDate;
      if (key === lo) return "start";
      if (key === hi) return "end";
      if (key > lo && key < hi) return "inRange";
    }
    if (key === startDate) return "start";
    if (key === todayKey)  return "today";
    return "normal";
  };

  return (
    <section
      className="wc-cal-pad"
      style={{ ...styles.section, background: theme?.card }}
    >
      <DayHeaders accent={accent} isDark={isDark} />

      <div
        style={styles.grid}
        onMouseLeave={() => { if (step === 1) onGridLeave(); }}
      >
        {cells.map((day, i) => {
          const col     = i % 7;
          const variant = getVariant(day);
          const holiday = day ? getHoliday(month, day) : null;

          return (
            <DayCell
              key={i}
              day={day}
              variant={variant}
              accent={accent}
              light={light}
              isWeekend={col === 0 || col === 6}
              holiday={holiday}
              month={month}
              year={year}
              onHolidayEnter={onHolidayEnter}
              onHolidayLeave={onHolidayLeave}
              isDark={isDark}
              onClick={() => {
                if (!day) return;
                // Also fire hover update on tap (mobile has no mousemove)
                if (step === 1) onDayHover(toKey(year, month, day));
                onDayClick(day);
              }}
            />
          );
        })}
      </div>

      <RangeBar
        accent={accent}
        step={step}
        rangeLabel={rangeLabel}
        startDate={startDate}
        onClear={onClearSelection}
        isDark={isDark}
      />

      <RangeStats
        startDate={startDate}
        endDate={endDate}
        accent={accent}
        light={light}
        isDark={isDark}
      />
    </section>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = {
  section: {
    padding: "20px 22px 16px",
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    marginBottom: 4,
  },
  headerCell: {
    textAlign: "center",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    padding: "4px 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
  },

  // The outer cell is the ONLY tappable element.
  // It is the full grid cell, handles background (range band),
  // and forwards clicks to onDayClick.
  cellOuter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3px 0",
    cursor: "pointer",
    position: "relative",
    // Remove 300ms tap delay — most important mobile fix
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    // min tap target
    minHeight: 42,
  },

  emptyCell: {
    minHeight: 42,
  },

  // The inner circle is PURELY visual — pointer-events none
  circle: {
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    fontSize: 13,
    fontWeight: 400,
    // NO pointer events — the outer cellOuter handles all clicks
    pointerEvents: "none",
    position: "relative",
    zIndex: 1,
  },

  rangeBar: {
    marginTop: 12,
    padding: "10px 14px",
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 40,
    border: "1px solid",
  },

  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 11,
    fontFamily: "inherit",
    fontWeight: 500,
    padding: "4px 12px",
    borderRadius: 6,
    color: "#bbb",
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
  },
};
