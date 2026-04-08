"use client";
/**
 * NotesSidebar
 *
 * Renders:
 *  1. Notes editor (textarea + save button) for the selected date range
 *  2. Saved notes list with click-to-load and delete
 *  3. Legend explaining visual indicators
 *
 * Purely presentational — all state/handlers come from WallCalendar via props.
 */
import { fmt } from "./utils";

// ─── Notes Editor ──────────────────────────────────────────────────────────
function NotesEditor({ accent, canEdit, step, noteText, setNoteText, saveFeedback, onSave, noteSub, isDark }) {
  const placeholder = canEdit
    ? "Write your note here…"
    : step === 1
    ? "Complete the date range first…"
    : "Select a date range to add a note";

  return (
    <div>
      <div style={{ ...styles.sectionLabel, color: accent }}>Notes</div>
      <div style={{ ...styles.subText, color: isDark ? "#666" : "#b0b0b0" }}>{noteSub}</div>

      <textarea
        className="wc-textarea"
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        disabled={!canEdit}
        placeholder={placeholder}
        aria-label="Note for selected date range"
        style={{
          ...styles.textarea,
          borderColor: canEdit ? accent : (isDark ? "#333" : "#e4e4e4"),
          color: canEdit ? (isDark ? "#ddd" : "#333") : (isDark ? "#444" : "#bbb"),
          cursor: canEdit ? "text" : "not-allowed",
        }}
      />

      <button
        className="wc-save-btn"
        onClick={onSave}
        disabled={!canEdit}
        aria-label={canEdit ? "Save note" : "Select a date range first"}
        style={{
          ...styles.saveBtn,
          background: canEdit ? accent : (isDark ? "#2a2a2c" : "#ebebeb"),
          color: canEdit ? "#fff" : (isDark ? "#444" : "#c0c0c0"),
          cursor: canEdit ? "pointer" : "not-allowed",
        }}
      >
        {saveFeedback ? "✓ Saved!" : "Save Note"}
      </button>
    </div>
  );
}

// ─── Saved Notes List ──────────────────────────────────────────────────────
function SavedNotesList({ accent, light, savedNotes, onLoadNote, onDeleteNote, isDark }) {
  const entries = Object.entries(savedNotes).filter(([, v]) => v.trim());
  if (entries.length === 0) return null;

  const itemBg = isDark ? "rgba(255,255,255,0.04)" : light;

  return (
    <div>
      <div style={{ ...styles.listHeader, color: isDark ? "#444" : "#ccc" }}>Saved Notes</div>
      <div className="wc-saved-list" style={styles.list} role="list">
        {entries.map(([k, v]) => {
          const [s, e] = k.split("__");
          return (
            <div
              key={k}
              className="wc-saved-item"
              role="listitem"
              onClick={() => onLoadNote(k)}
              style={{ ...styles.savedItem, background: itemBg, borderLeftColor: accent }}
              tabIndex={0}
              onKeyDown={(ev) => ev.key === "Enter" && onLoadNote(k)}
              aria-label={`Note: ${fmt(s)} to ${fmt(e)}`}
            >
              <div style={styles.savedItemHeader}>
                <span style={{ ...styles.savedDateRange, color: accent }}>
                  {fmt(s)} → {fmt(e)}
                </span>
                <button
                  className="wc-del"
                  onClick={(e) => onDeleteNote(k, e)}
                  aria-label="Delete note"
                  title="Delete"
                >
                  ×
                </button>
              </div>
              <div style={{ ...styles.savedSnippet, color: isDark ? "#666" : "#666" }}>{v}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Legend ────────────────────────────────────────────────────────────────
function Legend({ accent, light, isDark }) {
  const items = [
    { label: "Holiday",        dot: { background: accent } },
    { label: "Today",          dot: { background: "transparent", border: `2px solid ${accent}` } },
    { label: "Selected range", dot: { background: isDark ? "rgba(255,255,255,0.08)" : light, border: `1px solid ${accent}44` } },
  ];

  return (
    <div style={{ ...styles.legend, borderTopColor: isDark ? "#2e2e30" : "#f0f0f0" }} aria-label="Legend">
      {items.map(({ label, dot }) => (
        <div key={label} style={{ ...styles.legendItem, color: isDark ? "#555" : "#aaa" }}>
          <span style={{ ...styles.legendDot, ...dot }} aria-hidden="true" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function NotesSidebar({
  accent, light,
  canEdit, step,
  noteText, setNoteText,
  saveFeedback, onSave,
  savedNotes, onLoadNote, onDeleteNote,
  noteSub,
  isDark, theme,
}) {
  return (
    <aside
      className="wc-sidebar wc-side-pad"
      style={{ ...styles.sidebar, background: theme?.sidebar }}
      aria-label="Notes panel"
    >
      <NotesEditor
        accent={accent}
        canEdit={canEdit}
        step={step}
        noteText={noteText}
        setNoteText={setNoteText}
        saveFeedback={saveFeedback}
        onSave={onSave}
        noteSub={noteSub}
        isDark={isDark}
      />

      <SavedNotesList
        accent={accent}
        light={light}
        savedNotes={savedNotes}
        onLoadNote={onLoadNote}
        onDeleteNote={onDeleteNote}
        isDark={isDark}
      />

      <Legend accent={accent} light={light} isDark={isDark} />
    </aside>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = {
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    background: "#fdfcfb",
  },

  // Section label
  sectionLabel: {
    fontSize: 9.5,
    fontWeight: 700,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  subText: {
    fontSize: 11,
    color: "#b0b0b0",
    marginBottom: 10,
    lineHeight: 1.6,
    minHeight: 26,
  },

  // Textarea
  textarea: {
    width: "100%",
    minHeight: 100,
    border: "1.5px solid",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 12.5,
    fontFamily: "'Manrope', sans-serif",
    resize: "vertical",
    lineHeight: 1.7,
    display: "block",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },

  // Save button
  saveBtn: {
    width: "100%",
    padding: "10px 0",
    border: "none",
    borderRadius: 10,
    fontSize: 12.5,
    fontWeight: 600,
    fontFamily: "inherit",
    marginTop: 10,
    letterSpacing: 0.3,
    transition: "opacity 0.15s, transform 0.1s",
  },

  // Saved notes list
  listHeader: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "#ccc",
    marginBottom: 10,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxHeight: 200,
    overflowY: "auto",
    paddingRight: 2,
  },
  savedItem: {
    padding: "10px 12px",
    borderRadius: 10,
    borderLeft: "3px solid",
    cursor: "pointer",
    transition: "opacity 0.15s, transform 0.12s",
  },
  savedItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  savedDateRange: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 0.3,
  },
  savedSnippet: {
    fontSize: 11.5,
    color: "#666",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    lineHeight: 1.45,
  },

  // Legend
  legend: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    paddingTop: 14,
    borderTop: "1px solid #f0f0f0",
    marginTop: "auto",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 10.5,
    color: "#aaa",
  },
  legendDot: {
    width: 11,
    height: 11,
    borderRadius: "50%",
    flexShrink: 0,
    display: "inline-block",
  },
};
