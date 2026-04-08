"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { toKey, loadNotes, persistNotes } from "./utils";

export function useCalendar() {
  const now      = new Date();
  const todayKey = toKey(now.getFullYear(), now.getMonth(), now.getDate());

  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate]     = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [step, setStep]           = useState(0);

  const [savedNotes, setSavedNotes]     = useState({});
  const [noteText, setNoteText]         = useState("");
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [mounted, setMounted]           = useState(false);

  const [flipDir, setFlipDir]       = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [holidayTip, setHolidayTip] = useState(null);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const canEdit = !!(startDate && endDate);
  const noteKey = startDate && endDate ? `${startDate}__${endDate}` : null;

  useEffect(() => { setMounted(true); setSavedNotes(loadNotes()); }, []);
  useEffect(() => { if (mounted) persistNotes(savedNotes); }, [savedNotes, mounted]);
  useEffect(() => {
    if (canEdit && noteKey) setNoteText(savedNotes[noteKey] ?? "");
    else setNoteText("");
  }, [noteKey, canEdit]); // eslint-disable-line

  const goMonth = useCallback((dir) => {
    if (isFlipping) return;
    setFlipDir(dir > 0 ? "left" : "right");
    setIsFlipping(true);
    setTimeout(() => {
      setMonth((m) => {
        const nm = m + dir;
        if (nm < 0)  { setYear((y) => y - 1); return 11; }
        if (nm > 11) { setYear((y) => y + 1); return 0;  }
        return nm;
      });
      setStartDate(null); setEndDate(null); setStep(0);
      setNoteText(""); setHoverDate(null);
      setIsFlipping(false); setFlipDir(null);
    }, 320);
  }, [isFlipping]);

  const handleDayClick = useCallback((day) => {
    const key = toKey(year, month, day);
    if (step === 0) {
      setStartDate(key); setEndDate(null); setStep(1);
    } else {
      const [s, e] = key <= startDate ? [key, startDate] : [startDate, key];
      setStartDate(s); setEndDate(e); setStep(0); setHoverDate(null);
    }
  }, [step, startDate, year, month]);

  const clearSelection = useCallback(() => {
    setStartDate(null); setEndDate(null); setStep(0); setNoteText(""); setHoverDate(null);
  }, []);

  const saveNote = useCallback(() => {
    if (!noteKey || !canEdit) return;
    setSavedNotes((prev) => {
      const next = { ...prev };
      if (noteText.trim()) next[noteKey] = noteText; else delete next[noteKey];
      return next;
    });
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 1400);
  }, [noteKey, canEdit, noteText]);

  const deleteNote = useCallback((k, e) => {
    e.stopPropagation();
    setSavedNotes((prev) => { const n = { ...prev }; delete n[k]; return n; });
  }, []);

  const loadSavedNote = useCallback((k) => {
    const [s, e] = k.split("__");
    setStartDate(s); setEndDate(e); setStep(0);
  }, []);

  // ── Hero swipe — pure tracking, no preventDefault so nav button
  //    onClick still fires normally on mobile ───────────────────────────
  const handleHeroTouchStart = useCallback((e) => {
    // Don't track if touch started on a button (nav arrows)
    if (e.target.closest("button")) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleHeroTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    touchStartX.current = null;
    touchStartY.current = null;
    // Horizontal swipe: dx > 50px and not too vertical
    if (Math.abs(dx) > 50 && dy < 40) goMonth(dx < 0 ? 1 : -1);
  }, [goMonth]);

  return {
    year, month, goMonth,
    startDate, endDate, step, hoverDate, setHoverDate,
    handleDayClick, clearSelection,
    canEdit, noteKey, noteText, setNoteText,
    saveFeedback, saveNote, deleteNote, loadSavedNote, savedNotes,
    todayKey, flipDir, holidayTip, setHolidayTip,
    handleHeroTouchStart,
    handleHeroTouchEnd,
  };
}
