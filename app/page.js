"use client";
import { useState, useMemo, useEffect } from "react";

// ── Constants ──────────────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const THEMES = [
  "#2563eb","#db2777","#059669","#7c3aed","#0891b2",
  "#0369a1","#d97706","#dc2626","#b45309","#c2410c","#475569","#1e40af"
];

const IMAGES = [
  "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490750967868-88df5691bbfd?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1467220822224-72ed97fd27b6?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=900&auto=format&fit=crop",
];

const HOLIDAYS = {
  "01-01":"New Year's Day 🎆","02-14":"Valentine's Day 💝","03-17":"St. Patrick's Day 🍀",
  "04-22":"Earth Day 🌍","07-04":"Independence Day 🎇","10-31":"Halloween 🎃",
  "11-11":"Veterans Day 🎖️","12-24":"Christmas Eve 🎁","12-25":"Christmas Day 🎄","12-31":"New Year's Eve 🥂",
};

const LS_KEY = "wc_notes_v3";

function toKey(y,m,d){ return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
function fmt(k){ if(!k) return ""; const [y,m,d]=k.split("-"); return `${MONTHS[+m-1].slice(0,3)} ${+d}, ${y}`; }
function holiday(m,d){ return HOLIDAYS[`${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`]||null; }

// ── Main Component ─────────────────────────────────────────────────────────
export default function WallCalendar() {
  // Calculate using LOCAL time to fix timezone issue on deployed servers
  // new Date() on server = UTC, but user's browser = local time (e.g. IST = UTC+5:30)
  const [todayKey, setTodayKey] = useState("");
  const [year,  setYear]  = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [start, setStart] = useState(null);
  const [end,   setEnd]   = useState(null);
  const [step,  setStep]  = useState(0);
  const [hover, setHover] = useState(null);
  const [notes, setNotes] = useState({});
  const [text,  setText]  = useState("");
  const [saved, setSaved] = useState(false);
  const [dark,  setDark]  = useState(false);

  const accent = THEMES[month];

  // Set todayKey from CLIENT (browser local time) — fixes UTC timezone bug on Vercel/Netlify
  useEffect(() => {
    const now = new Date();
    setTodayKey(toKey(now.getFullYear(), now.getMonth(), now.getDate()));
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  }, []);

  // Load notes from localStorage
  useEffect(() => {
    try { setNotes(JSON.parse(localStorage.getItem(LS_KEY)||"{}")); } catch {}
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(notes)); } catch {}
  }, [notes]);

  // Sync text editor with selected range
  const noteKey = start && end ? `${start}__${end}` : null;
  useEffect(() => {
    setText(noteKey ? (notes[noteKey]||"") : "");
  }, [noteKey]); // eslint-disable-line

  // Build calendar cells
  const cells = useMemo(() => {
    const first = new Date(year, month, 1).getDay();
    const total = new Date(year, month+1, 0).getDate();
    const arr   = Array(first).fill(null);
    for (let d=1; d<=total; d++) arr.push(d);
    while (arr.length % 7) arr.push(null);
    return arr;
  }, [year, month]);

  // Navigate months
  function goMonth(dir) {
    let m = month + dir, y = year;
    if (m < 0)  { m = 11; y--; }
    if (m > 11) { m = 0;  y++; }
    setMonth(m); setYear(y);
    setStart(null); setEnd(null); setStep(0); setHover(null); setText("");
  }

  // Day click
  function clickDay(day) {
    const key = toKey(year, month, day);
    if (step === 0) {
      setStart(key); setEnd(null); setStep(1);
    } else {
      const [s,e] = key <= start ? [key,start] : [start,key];
      setStart(s); setEnd(e); setStep(0); setHover(null);
    }
  }

  // Get day variant for styling
  function variant(day) {
    if (!day) return "empty";
    const key    = toKey(year, month, day);
    const effEnd = end || (step===1 && hover ? hover : null);
    if (start && effEnd) {
      const lo = start < effEnd ? start : effEnd;
      const hi = start < effEnd ? effEnd : start;
      if (key === lo) return "start";
      if (key === hi) return "end";
      if (key > lo && key < hi) return "range";
    }
    if (key === start) return "start";
    if (key === todayKey) return "today";
    return "normal";
  }

  // Save note
  function saveNote() {
    if (!noteKey) return;
    setNotes(prev => {
      const n = {...prev};
      if (text.trim()) n[noteKey]=text; else delete n[noteKey];
      return n;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  }

  const canEdit = !!(start && end);
  const bg   = dark ? "#111" : "#f2ede8";
  const card = dark ? "#1c1c1e" : "#fff";
  const side = dark ? "#242426" : "#fafafa";

  const lightAccent = accent + "22";

  return (
    <div style={{ background: bg, minHeight: "100vh", padding: "16px", fontFamily: "system-ui, sans-serif", transition: "background 0.3s" }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=Manrope:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        .day-btn { transition: opacity 0.1s; }
        .day-btn:active { opacity: 0.5 !important; }
        .nav-btn:active { opacity: 0.6 !important; }
        .wc-body { display: grid; grid-template-columns: 1fr 260px; }
        @media(max-width:600px){ .wc-body { grid-template-columns: 1fr !important; } .wc-sidebar { border-left: none !important; border-top: 1px solid #eee; } }
      `}</style>

      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color: dark?"#666":"#bbb", fontFamily:"Manrope,sans-serif" }}>
            📅 Wall Calendar
          </span>
          {/* DARK MODE — plain button, nothing fancy */}
          <button
            onClick={() => setDark(d => !d)}
            style={{
              padding:"8px 18px", borderRadius:99,
              border:`1px solid ${dark?"#444":"#ddd"}`,
              background: dark?"#2a2a2a":"#fff",
              color: dark?"#aaa":"#555",
              cursor:"pointer", fontSize:13, fontFamily:"Manrope,sans-serif",
              fontWeight:600,
              WebkitTapHighlightColor:"transparent",
              touchAction:"manipulation",
            }}
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Card */}
        <div style={{ background:card, borderRadius:16, overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,0.12)", transition:"background 0.3s" }}>

          {/* Spiral */}
          <div style={{ display:"flex", justifyContent:"center", gap:9, padding:"4px 16px", background: dark?"#1c1c1e":"#ede9e3" }}>
            {Array.from({length:14}).map((_,i) => (
              <div key={i} style={{ width:18, height:18, borderRadius:"50%", background:"linear-gradient(145deg,#ddd,#999)", boxShadow:"0 2px 4px rgba(0,0,0,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#333" }} />
              </div>
            ))}
          </div>

          {/* Hero image */}
          <div style={{ position:"relative", height:220, overflow:"hidden" }}>
            <img
              src={IMAGES[month]}
              alt={MONTHS[month]}
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", pointerEvents:"none", userSelect:"none" }}
              onError={e => { e.target.src=`https://picsum.photos/seed/${month}/900/300`; }}
            />
            <div style={{ position:"absolute", inset:0, background:`linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)`, pointerEvents:"none" }} />

            {/* PREV button */}
            <button
              className="nav-btn"
              onClick={() => goMonth(-1)}
              style={{
                position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
                width:44, height:44, borderRadius:"50%",
                background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)",
                color:"#fff", fontSize:22, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                touchAction:"manipulation", WebkitTapHighlightColor:"transparent",
                zIndex:10,
              }}
            >‹</button>

            {/* NEXT button */}
            <button
              className="nav-btn"
              onClick={() => goMonth(1)}
              style={{
                position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                width:44, height:44, borderRadius:"50%",
                background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)",
                color:"#fff", fontSize:22, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                touchAction:"manipulation", WebkitTapHighlightColor:"transparent",
                zIndex:10,
              }}
            >›</button>

            {/* Month label */}
            <div style={{ position:"absolute", bottom:16, right:18, textAlign:"right", pointerEvents:"none" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", letterSpacing:3, textTransform:"uppercase", fontFamily:"Manrope,sans-serif" }}>{year}</div>
              <div style={{ fontFamily:"Lora,serif", fontSize:36, fontWeight:700, color:"#fff", lineHeight:1, textShadow:"0 2px 12px rgba(0,0,0,0.4)" }}>{MONTHS[month]}</div>
            </div>
          </div>

          {/* Body: grid + sidebar */}
          <div className="wc-body">

            {/* Calendar grid */}
            <div style={{ padding:"18px 16px 16px" }}>

              {/* Day headers */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:4 }}>
                {DAYS.map((d,i) => (
                  <div key={d} style={{ textAlign:"center", fontSize:9, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", padding:"4px 0", color:(i===0||i===6)?accent:(dark?"#555":"#bbb"), fontFamily:"Manrope,sans-serif" }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div
                style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)" }}
                onMouseLeave={() => step===1 && setHover(null)}
              >
                {cells.map((day, i) => {
                  const col = i % 7;
                  const v   = variant(day);
                  const isWE = col===0||col===6;
                  const isStart  = v==="start";
                  const isEnd    = v==="end";
                  const isRange  = v==="range";
                  const isToday  = v==="today";
                  const hasBg    = isStart||isEnd||isRange;

                  // circle colour
                  let circleStyle = {
                    width:36, height:36, borderRadius:"50%",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:13, fontWeight:400, pointerEvents:"none",
                    color: isWE ? accent : (dark?"#ccc":"#333"),
                    border:"2px solid transparent",
                    fontFamily:"Manrope,sans-serif",
                    transition:"transform 0.1s",
                  };
                  if (isStart||isEnd) circleStyle = {...circleStyle, background:accent, color:"#fff", fontWeight:700, boxShadow:`0 2px 10px ${accent}55`};
                  else if (isRange)  circleStyle = {...circleStyle, color:accent, fontWeight:600, borderRadius:0};
                  else if (isToday)  circleStyle = {...circleStyle, border:`2px solid ${accent}`, color:accent, fontWeight:700};

                  return (
                    <button
                      key={i}
                      onClick={() => day && clickDay(day)}
                      disabled={!day}
                      style={{
                        display:"flex", alignItems:"center", justifyContent:"center",
                        padding:"3px 0", minHeight:42, minWidth:0,
                        border:"none", background:"transparent",
                        cursor: day ? "pointer" : "default",
                        touchAction:"manipulation",
                        WebkitTapHighlightColor:"transparent",
                        userSelect:"none",
                        opacity:1,
                        backgroundImage: isStart
                          ? `linear-gradient(to right, transparent 50%, ${accent}22 50%)`
                          : isEnd
                          ? `linear-gradient(to left, transparent 50%, ${accent}22 50%)`
                          : undefined,
                        background: isRange ? `${accent}22` : undefined,
                      }}
                    >
                      {day ? (
                        <div style={{...circleStyle, pointerEvents:"none"}}>
                          {day}
                          {holiday(month,day) && (
                            <span style={{ position:"absolute", bottom:1, left:"50%", transform:"translateX(-50%)", width:4, height:4, borderRadius:"50%", background:(isStart||isEnd)?"#fff":accent, pointerEvents:"none" }} />
                          )}
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Range bar */}
              <div style={{ marginTop:10, padding:"9px 12px", borderRadius:8, background:dark?"#2a2a2c":"#f5f5f5", border:`1px solid ${start?accent+"44":"#eee"}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:11.5, color:step===1?accent:(dark?"#555":"#aaa"), fontWeight:step===1?600:400, fontFamily:"Manrope,sans-serif" }}>
                  {step===1 ? "📅 " : ""}
                  {!start ? "Tap a date to start" : step===1 ? `From ${fmt(start)} — pick end` : `${fmt(start)} → ${fmt(end)}`}
                </span>
                {start && (
                  <button onClick={() => { setStart(null); setEnd(null); setStep(0); setText(""); setHover(null); }}
                    style={{ background:"none", border:"none", cursor:"pointer", fontSize:11, color:dark?"#555":"#bbb", padding:"2px 8px", touchAction:"manipulation" }}>
                    Clear
                  </button>
                )}
              </div>

              {/* Stats */}
              {start && end && (() => {
                const [sy,sm,sd]=start.split("-").map(Number);
                const [ey,em,ed]=end.split("-").map(Number);
                const days = Math.round((new Date(ey,em-1,ed)-new Date(sy,sm-1,sd))/86400000)+1;
                return (
                  <div style={{ marginTop:8, padding:"8px 12px", borderRadius:8, background:`${accent}18`, border:`1px solid ${accent}33`, display:"flex", gap:16, alignItems:"center" }}>
                    <span style={{ fontFamily:"Lora,serif", fontSize:20, fontWeight:700, color:accent }}>{days}</span>
                    <span style={{ fontSize:10, color:dark?"#555":"#aaa", fontFamily:"Manrope,sans-serif", textTransform:"uppercase", letterSpacing:1 }}>{days===1?"day":"days"}</span>
                    <span style={{ fontFamily:"Lora,serif", fontSize:20, fontWeight:700, color:accent }}>{(days/7).toFixed(1)}</span>
                    <span style={{ fontSize:10, color:dark?"#555":"#aaa", fontFamily:"Manrope,sans-serif", textTransform:"uppercase", letterSpacing:1 }}>weeks</span>
                  </div>
                );
              })()}
            </div>

            {/* Sidebar */}
            <div className="wc-sidebar" style={{ padding:"18px 16px", background:side, borderLeft:`1px solid ${dark?"#2e2e30":"#eee"}`, display:"flex", flexDirection:"column", gap:16, transition:"background 0.3s" }}>
              <div>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.8, textTransform:"uppercase", color:accent, marginBottom:4, fontFamily:"Manrope,sans-serif" }}>Notes</div>
                <div style={{ fontSize:11, color:dark?"#555":"#aaa", marginBottom:8, fontFamily:"Manrope,sans-serif" }}>
                  {!start ? "Select a range first" : step===1 ? "Pick an end date" : `${fmt(start)} → ${fmt(end)}`}
                </div>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  disabled={!canEdit}
                  placeholder={canEdit ? "Write your note…" : "Select a date range first"}
                  style={{
                    width:"100%", minHeight:90, padding:"9px 11px",
                    border:`1.5px solid ${canEdit?accent:(dark?"#333":"#e0e0e0")}`,
                    borderRadius:8, fontSize:12.5, resize:"vertical", lineHeight:1.6,
                    fontFamily:"Manrope,sans-serif",
                    background:canEdit?(dark?"#2a2a2c":"#fff"):(dark?"#222":"#f8f8f8"),
                    color:canEdit?(dark?"#ddd":"#333"):(dark?"#444":"#aaa"),
                    cursor:canEdit?"text":"not-allowed",
                    outline:"none",
                    touchAction:"manipulation",
                  }}
                />
                <button
                  onClick={saveNote}
                  disabled={!canEdit}
                  style={{
                    width:"100%", padding:"10px 0", marginTop:8,
                    border:"none", borderRadius:8, fontSize:12.5, fontWeight:600,
                    fontFamily:"Manrope,sans-serif", cursor:canEdit?"pointer":"not-allowed",
                    background:canEdit?accent:(dark?"#2a2a2c":"#eee"),
                    color:canEdit?"#fff":(dark?"#444":"#bbb"),
                    touchAction:"manipulation",
                    WebkitTapHighlightColor:"transparent",
                  }}
                >
                  {saved ? "✓ Saved!" : "Save Note"}
                </button>
              </div>

              {/* Saved notes */}
              {Object.entries(notes).filter(([,v])=>v.trim()).length > 0 && (
                <div>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:dark?"#444":"#ccc", marginBottom:8, fontFamily:"Manrope,sans-serif" }}>Saved</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:180, overflowY:"auto" }}>
                    {Object.entries(notes).filter(([,v])=>v.trim()).map(([k,v]) => {
                      const [s,e] = k.split("__");
                      return (
                        <div key={k}
                          onClick={() => { const[s2,e2]=k.split("__"); setStart(s2); setEnd(e2); setStep(0); }}
                          style={{ padding:"8px 10px", borderRadius:8, background:`${accent}18`, borderLeft:`3px solid ${accent}`, cursor:"pointer", touchAction:"manipulation" }}>
                          <div style={{ display:"flex", justifyContent:"space-between" }}>
                            <span style={{ fontSize:10, color:accent, fontWeight:600, fontFamily:"Manrope,sans-serif" }}>{fmt(s)} → {fmt(e)}</span>
                            <button onClick={ev => { ev.stopPropagation(); setNotes(p=>{ const n={...p}; delete n[k]; return n; }); }}
                              style={{ background:"none", border:"none", cursor:"pointer", color:dark?"#555":"#ccc", fontSize:14, touchAction:"manipulation" }}>×</button>
                          </div>
                          <div style={{ fontSize:11, color:dark?"#666":"#888", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"Manrope,sans-serif" }}>{v}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Legend */}
              <div style={{ marginTop:"auto", paddingTop:12, borderTop:`1px solid ${dark?"#2e2e30":"#f0f0f0"}` }}>
                {[["Holiday dot", accent], ["Today", accent], ["Range", accent]].map(([label, c]) => (
                  <div key={label} style={{ display:"flex", alignItems:"center", gap:7, fontSize:10.5, color:dark?"#555":"#aaa", marginBottom:5, fontFamily:"Manrope,sans-serif" }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:label==="Range"?`${c}33`:label==="Today"?"transparent":c, border:label==="Today"?`2px solid ${c}`:undefined, flexShrink:0 }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign:"center", marginTop:14, fontSize:10, color:dark?"#555":"#bbb", letterSpacing:1.5, textTransform:"uppercase", fontFamily:"Manrope,sans-serif" }}>
          {year} · Wall Calendar
        </div>
      </div>
    </div>
  );
}