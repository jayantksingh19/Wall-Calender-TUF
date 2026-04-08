"use client";
import { useState, useEffect } from "react";
import { MONTH_THEME } from "./constants";
import { fmt, getHoliday, getMonthProgress } from "./utils";
import { useCalendar } from "./useCalendar";

import CalendarStyles  from "./CalendarStyles";
import HolidayTooltip  from "./HolidayTooltip";
import CalendarHeader  from "./CalendarHeader";
import CalendarGrid    from "./CalendarGrid";
import NotesSidebar    from "./NotesSidebar";
import ThemeToggle     from "./ThemeToggle";

export default function WallCalendar() {
  const cal = useCalendar();
  const { accent, light, dark } = MONTH_THEME[cal.month];
  const [isDark, setIsDark] = useState(false);

  // Apply dark class to <html> so CSS vars work globally
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const rangeLabel = !cal.startDate
    ? "Tap a date to start selecting"
    : cal.step === 1
    ? `From ${fmt(cal.startDate)} — tap an end date`
    : `${fmt(cal.startDate)}  →  ${fmt(cal.endDate)}`;

  const noteSub = !cal.startDate
    ? "Select a date range to add a note"
    : cal.step === 1
    ? "Tap an end date to complete the range"
    : `${fmt(cal.startDate)} → ${fmt(cal.endDate)}`;

  const monthProgress = getMonthProgress(cal.year, cal.month);

  const flipClass =
    cal.flipDir === "left"  ? "wc-flip-left"  :
    cal.flipDir === "right" ? "wc-flip-right" : "";

  const theme = isDark
    ? { page: "#111",    card: "#1c1c1e", sidebar: "#242426",
        footer: "#555",  border: "#333",  sidebarBorder: "#2e2e30" }
    : { page: "#f2ede8", card: "#fff",    sidebar: "#fdfcfb",
        footer: "#b8b0a6", border: "#efefef", sidebarBorder: "#efefef" };

  return (
    <div style={{ fontFamily: "'Manrope',sans-serif", minHeight: "100vh", background: theme.page, padding: "20px 16px 48px", transition: "background 0.35s" }}>
      <CalendarStyles accent={accent} isDark={isDark} theme={theme} />
      <HolidayTooltip tip={cal.holidayTip} />

      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, padding: "0 2px" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: isDark ? "#888" : "#c4b9af" }}>
            📅 Wall Calendar
          </span>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
        </div>

        {/* Card */}
        <main
          className={flipClass}
          style={{
            background: theme.card, borderRadius: 18, overflow: "hidden",
            transformOrigin: "center center",
            boxShadow: isDark
              ? "0 14px 52px rgba(0,0,0,0.5),0 2px 10px rgba(0,0,0,0.3)"
              : "0 14px 52px rgba(0,0,0,0.13),0 2px 10px rgba(0,0,0,0.06)",
            transition: "background 0.35s, box-shadow 0.35s",
          }}
        >
          <CalendarHeader
            month={cal.month}
            year={cal.year}
            dark={dark}
            monthProgress={monthProgress}
            onPrev={() => cal.goMonth(-1)}
            onNext={() => cal.goMonth(1)}
            isDark={isDark}
            onHeroTouchStart={cal.handleHeroTouchStart}
            onHeroTouchEnd={cal.handleHeroTouchEnd}
          />

          <div className="wc-body-layout">
            <CalendarGrid
              month={cal.month}
              year={cal.year}
              accent={accent}
              light={light}
              startDate={cal.startDate}
              endDate={cal.endDate}
              step={cal.step}
              hoverDate={cal.hoverDate}
              todayKey={cal.todayKey}
              rangeLabel={rangeLabel}
              getHoliday={getHoliday}
              onDayClick={cal.handleDayClick}
              onDayHover={cal.setHoverDate}
              onGridLeave={() => cal.setHoverDate(null)}
              onHolidayEnter={cal.setHolidayTip}
              onHolidayLeave={() => cal.setHolidayTip(null)}
              onClearSelection={cal.clearSelection}
              isDark={isDark}
              theme={theme}
            />

            <NotesSidebar
              accent={accent}
              light={light}
              canEdit={cal.canEdit}
              step={cal.step}
              noteText={cal.noteText}
              setNoteText={cal.setNoteText}
              saveFeedback={cal.saveFeedback}
              onSave={cal.saveNote}
              savedNotes={cal.savedNotes}
              onLoadNote={cal.loadSavedNote}
              onDeleteNote={cal.deleteNote}
              noteSub={noteSub}
              isDark={isDark}
              theme={theme}
            />
          </div>
        </main>

        <footer style={{ textAlign: "center", marginTop: 18, fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase", fontWeight: 500, color: theme.footer, transition: "color 0.35s" }}>
          {cal.year} · Wall Calendar<span style={{ opacity: 0.5 }}> · Swipe photo to change month</span>
        </footer>
      </div>
    </div>
  );
}
