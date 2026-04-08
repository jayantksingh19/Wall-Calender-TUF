"use client";
import { MONTHS, HERO_IMAGES } from "./constants";

function SpiralBinding({ bg }) {
  return (
    <div style={{ ...styles.spiralRow, background: bg ?? "#f0ede8" }} aria-hidden="true">
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className="wc-coil" style={styles.coil}>
          <div style={styles.coilOuter}><div style={styles.coilHole} /></div>
          <div style={styles.coilPin} />
        </div>
      ))}
    </div>
  );
}

export default function CalendarHeader({
  month, year, dark, monthProgress,
  onPrev, onNext, isDark,
  onHeroTouchStart, onHeroTouchEnd,
}) {
  const spiralBg = isDark ? "#1c1c1e" : "#f0ede8";

  return (
    <>
      <SpiralBinding bg={spiralBg} />

      <div
        className="wc-hero"
        style={styles.hero}
        onTouchStart={onHeroTouchStart}
        onTouchEnd={onHeroTouchEnd}
      >
        <img
          src={HERO_IMAGES[month]}
          alt={`${MONTHS[month]} ${year}`}
          style={styles.heroImg}
          onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${month}${year}/1400/500`; }}
          draggable={false}
        />
        <div style={{ ...styles.overlay, background: `linear-gradient(to bottom,rgba(0,0,0,0.02) 0%,${dark}dd 100%)` }} />

        <button
          className="wc-nav"
          onClick={onPrev}
          style={{ ...styles.navBtn, left: 14 }}
          aria-label="Previous month"
        >‹</button>

        <button
          className="wc-nav"
          onClick={onNext}
          style={{ ...styles.navBtn, right: 14 }}
          aria-label="Next month"
        >›</button>

        <div style={styles.monthLabel}>
          <div style={styles.yearText}>{year}</div>
          <div className="wc-month-name" style={styles.monthText}>{MONTHS[month]}</div>
        </div>

        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${monthProgress * 100}%` }} />
        </div>
      </div>
    </>
  );
}

const styles = {
  spiralRow: {
    display: "flex", justifyContent: "center", alignItems: "flex-end",
    gap: 10, padding: "0 20px",
  },
  coil: { display: "flex", flexDirection: "column", alignItems: "center" },
  coilOuter: {
    width: 22, height: 22, borderRadius: "50%",
    background: "linear-gradient(145deg,#e8e8e8 0%,#b0b0b0 40%,#888 70%,#c4c4c4 100%)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3),inset 0 1px 2px rgba(255,255,255,0.6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", zIndex: 2,
  },
  coilHole: {
    width: 10, height: 10, borderRadius: "50%",
    background: "radial-gradient(circle at 35% 35%,#555,#1a1a1a)",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.8)",
  },
  coilPin: {
    width: 4, height: 14,
    background: "linear-gradient(to bottom,#c8c8c8,#909090,#b8b8b8)",
    borderRadius: "0 0 2px 2px", boxShadow: "1px 0 2px rgba(0,0,0,0.15)",
    marginTop: -1, zIndex: 1,
  },
  hero: {
    position: "relative", overflow: "hidden", userSelect: "none",
    // manipulation = no 300ms delay, allows our custom swipe logic
    touchAction: "manipulation",
  },
  heroImg: {
    width: "100%", height: "100%", objectFit: "cover",
    display: "block", pointerEvents: "none",
  },
  overlay: { position: "absolute", inset: 0, pointerEvents: "none" },
  navBtn: {
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.18)",
    border: "1px solid rgba(255,255,255,0.35)",
    backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
    color: "#fff", width: 48, height: 48, borderRadius: "50%",
    cursor: "pointer", fontSize: 28,
    display: "flex", alignItems: "center", justifyContent: "center",
    lineHeight: 1, zIndex: 10, fontFamily: "inherit",
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
  },
  monthLabel: {
    position: "absolute", bottom: 28, right: 20,
    textAlign: "right", zIndex: 5, pointerEvents: "none",
  },
  yearText: {
    fontSize: 11, color: "rgba(255,255,255,0.65)", letterSpacing: 4,
    textTransform: "uppercase", marginBottom: 3, fontWeight: 500,
    fontFamily: "'Manrope',sans-serif",
  },
  monthText: {
    fontFamily: "'Lora',serif", fontWeight: 700, color: "#fff",
    lineHeight: 1, textShadow: "0 2px 20px rgba(0,0,0,0.35)",
  },
  progressTrack: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: 3, background: "rgba(255,255,255,0.15)",
    zIndex: 5, pointerEvents: "none",
  },
  progressFill: {
    height: "100%", background: "rgba(255,255,255,0.7)",
    borderRadius: "0 3px 3px 0", transition: "width 0.8s ease",
  },
};
