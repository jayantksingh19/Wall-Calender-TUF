"use client";
/**
 * CalendarStyles — ALL global CSS in one place.
 * Media queries, pseudo-selectors, keyframes, scrollbar.
 */
export default function CalendarStyles({ accent, isDark, theme }) {
  const rangeBarBg   = isDark ? "#2a2a2c" : "#f8f8f8";
  const scrollThumb  = isDark ? "#3a3a3c" : "#e0e0e0";
  const placeholderC = isDark ? "#555"    : "#bbb";

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Manrope:wght@300;400;500;600;700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      /* ── Layout desktop ──────────────────────────────────────────────────── */
      .wc-body-layout { display: grid; grid-template-columns: 1fr 280px; }
      .wc-sidebar {
        border-left: 1px solid ${theme.sidebarBorder};
        padding: 22px 20px;
        transition: background 0.35s, border-color 0.35s;
      }
      .wc-hero        { height: 260px; }
      .wc-month-name  { font-size: 42px; }

      /* ── Tablet ≤820px ───────────────────────────────────────────────────── */
      @media (max-width: 820px) {
        .wc-body-layout { grid-template-columns: 1fr 240px; }
        .wc-month-name  { font-size: 34px !important; }
        .wc-hero        { height: 220px !important; }
      }

      /* ── Mobile ≤600px ───────────────────────────────────────────────────── */
      @media (max-width: 600px) {
        .wc-body-layout { grid-template-columns: 1fr !important; }
        .wc-sidebar {
          border-left: none !important;
          border-top: 1px solid ${theme.sidebarBorder} !important;
          padding: 18px 16px !important;
        }
        .wc-hero        { height: 190px !important; }
        .wc-month-name  { font-size: 28px !important; }
        .wc-cal-pad     { padding: 12px 10px 12px !important; }
      }

      /* ── Day cell: hover only on pointer devices, active for touch ───────── */
      @media (hover: hover) {
        .wc-day-cell:hover .wc-day-circle { transform: scale(1.1); }
      }
      .wc-day-cell:active { opacity: 0.65; }

      /* ── Holiday dot ─────────────────────────────────────────────────────── */
      .wc-holiday-dot {
        width: 4px; height: 4px; border-radius: 50%;
        position: absolute; bottom: 2px; left: 50%;
        transform: translateX(-50%);
        opacity: 0.85;
        pointer-events: none;
      }

      /* ── Today pulse ─────────────────────────────────────────────────────── */
      @keyframes todayPulse {
        0%, 100% { box-shadow: 0 0 0 0   ${accent}55; }
        50%      { box-shadow: 0 0 0 6px ${accent}00; }
      }
      .wc-today { animation: todayPulse 2.8s ease-in-out infinite; }

      /* ── Nav buttons ─────────────────────────────────────────────────────── */
      .wc-nav {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        transition: background 0.15s, transform 0.12s;
      }
      @media (hover: hover) {
        .wc-nav:hover { background: rgba(255,255,255,0.3) !important; transform: translateY(-50%) scale(1.1); }
      }
      .wc-nav:active { transform: translateY(-50%) scale(0.9) !important; opacity: 0.8; }

      /* ── Textarea ────────────────────────────────────────────────────────── */
      .wc-textarea {
        background: ${isDark ? "#2a2a2c" : "#fff"};
        color: ${isDark ? "#ddd" : "#333"};
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .wc-textarea:focus {
        outline: none;
        box-shadow: 0 0 0 3px ${accent}30;
        border-color: ${accent} !important;
      }
      .wc-textarea::placeholder { color: ${placeholderC}; }
      .wc-textarea:disabled     { cursor: not-allowed; }

      /* ── Save button ─────────────────────────────────────────────────────── */
      .wc-save-btn {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        transition: opacity 0.15s, transform 0.1s;
      }
      .wc-save-btn:not(:disabled):active { transform: scale(0.97); opacity: 0.85; }
      @media (hover: hover) {
        .wc-save-btn:not(:disabled):hover { opacity: 0.88; transform: translateY(-1px); }
      }

      /* ── Clear button ────────────────────────────────────────────────────── */
      .wc-clear {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        color: ${isDark ? "#555" : "#ccc"};
        transition: color 0.12s, background 0.12s;
      }
      @media (hover: hover) {
        .wc-clear:hover { background: ${isDark ? "#333" : "#f0f0f0"} !important; color: ${isDark ? "#999" : "#666"} !important; }
      }

      /* ── Range bar ───────────────────────────────────────────────────────── */
      .wc-range-bar { background: ${rangeBarBg} !important; transition: border-color 0.2s, background 0.35s; }

      /* ── Saved note rows ─────────────────────────────────────────────────── */
      .wc-saved-item {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        transition: opacity 0.15s, transform 0.12s;
      }
      .wc-saved-item:active { opacity: 0.7; }
      @media (hover: hover) { .wc-saved-item:hover { opacity: 0.85; transform: translateX(3px); } }
      .wc-saved-item:focus  { outline: 2px solid ${accent}55; outline-offset: 2px; }

      /* ── Delete button ───────────────────────────────────────────────────── */
      .wc-del {
        background: none; border: none; cursor: pointer;
        color: ${isDark ? "#555" : "#ccc"};
        font-size: 15px; line-height: 1; padding: 0 0 0 6px;
        transition: color 0.12s; flex-shrink: 0; font-family: inherit;
        touch-action: manipulation; -webkit-tap-highlight-color: transparent;
      }
      .wc-del:hover { color: #e53e3e; }

      /* ── Saved notes scrollbar ───────────────────────────────────────────── */
      .wc-saved-list::-webkit-scrollbar       { width: 4px; }
      .wc-saved-list::-webkit-scrollbar-thumb { background: ${scrollThumb}; border-radius: 4px; }

      /* ── Holiday tooltip ─────────────────────────────────────────────────── */
      .wc-tip {
        position: fixed; background: #1a1a1a; color: #fff;
        font-size: 10px; padding: 4px 10px; border-radius: 6px;
        pointer-events: none; z-index: 9999; white-space: nowrap;
        font-family: 'Manrope', sans-serif; letter-spacing: 0.3px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      }

      /* ── Page flip ───────────────────────────────────────────────────────── */
      @keyframes flipLeft {
        0%   { transform: perspective(1200px) rotateY(0deg);   opacity: 1;   }
        50%  { transform: perspective(1200px) rotateY(-10deg); opacity: 0.6; }
        100% { transform: perspective(1200px) rotateY(0deg);   opacity: 1;   }
      }
      @keyframes flipRight {
        0%   { transform: perspective(1200px) rotateY(0deg);  opacity: 1;   }
        50%  { transform: perspective(1200px) rotateY(10deg); opacity: 0.6; }
        100% { transform: perspective(1200px) rotateY(0deg);  opacity: 1;   }
      }
      .wc-flip-left  { animation: flipLeft  0.32s ease-in-out; }
      .wc-flip-right { animation: flipRight 0.32s ease-in-out; }

      /* ── Spiral coil hover ───────────────────────────────────────────────── */
      @media (hover: hover) {
        .wc-coil:hover > div:first-child {
          transform: scale(1.18) rotate(-8deg);
          box-shadow: 0 5px 14px rgba(0,0,0,0.35), inset 0 1px 3px rgba(255,255,255,0.7) !important;
        }
      }
    `}</style>
  );
}
