"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Month/Year Picker (same as Step3) ───────────────────────────────────────

function MonthYearPicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  inputBg,
  border,
  textPrimary,
  textMuted,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  inputBg: string;
  border: string;
  textPrimary: string;
  textMuted: string;
}) {
  const [open, setOpen] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    if (value) return parseInt(value.slice(0, 4));
    return new Date().getFullYear();
  });
  const ref = useRef<HTMLDivElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);

  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const YEARS = Array.from(
    { length: 80 },
    (_, i) => new Date().getFullYear() - i + 10,
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowYearDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (showYearDropdown && yearListRef.current) {
      const selected = yearListRef.current.querySelector(
        '[data-selected="true"]',
      );
      if (selected) selected.scrollIntoView({ block: "center" });
    }
  }, [showYearDropdown]);

  const selectedYear = value ? parseInt(value.slice(0, 4)) : null;
  const selectedMonth = value ? parseInt(value.slice(5, 7)) - 1 : null;
  const displayValue = value
    ? `${MONTHS[parseInt(value.slice(5, 7)) - 1]} ${value.slice(0, 4)}`
    : "";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen((o) => !o);
            setShowYearDropdown(false);
          }
        }}
        className="w-full rounded-xl px-4 py-3 text-sm text-left outline-none flex items-center justify-between gap-2"
        style={{
          background: inputBg,
          border: `1px solid ${open ? "#6366f1" : border}`,
          color: displayValue ? textPrimary : textMuted,
          opacity: disabled ? 0.4 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
          boxShadow: open ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <span>{displayValue || placeholder}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: textMuted, flexShrink: 0 }}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              top: "calc(100% + 8px)",
              left: 0,
              width: "264px",
              background: "#0e0e1a",
              border: "1px solid rgba(99,102,241,0.25)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <button
                type="button"
                onClick={() => setViewYear((y) => y - 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  color: "#9090b0",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className="flex items-center gap-1">
                <span
                  className="text-sm font-semibold px-2"
                  style={{ color: "#ffffff" }}
                >
                  {selectedMonth !== null && selectedYear === viewYear
                    ? MONTHS[selectedMonth]
                    : "—"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowYearDropdown((o) => !o);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    color: "#ffffff",
                    background: showYearDropdown
                      ? "rgba(99,102,241,0.2)"
                      : "transparent",
                    border: showYearDropdown
                      ? "1px solid rgba(99,102,241,0.4)"
                      : "1px solid transparent",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!showYearDropdown)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    if (!showYearDropdown)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {viewYear}
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: showYearDropdown
                        ? "rotate(180deg)"
                        : "rotate(0)",
                      transition: "transform 0.15s",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setViewYear((y) => y + 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  color: "#9090b0",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Year dropdown */}
            <AnimatePresence>
              {showYearDropdown && (
                <motion.div
                  ref={yearListRef}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="overflow-y-auto"
                  style={{
                    maxHeight: "200px",
                    background: "#0e0e1a",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {YEARS.map((year) => {
                    const isActive = year === viewYear;
                    return (
                      <button
                        key={year}
                        data-selected={isActive}
                        type="button"
                        onClick={() => {
                          setViewYear(year);
                          setShowYearDropdown(false);
                        }}
                        className="w-full px-5 py-2 text-sm text-left transition-all"
                        style={{
                          background: isActive ? "#6366f1" : "transparent",
                          color: isActive ? "#ffffff" : "#9090b0",
                          fontWeight: isActive ? 700 : 400,
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive)
                            e.currentTarget.style.background =
                              "rgba(99,102,241,0.12)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive)
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {year}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Month grid */}
            {!showYearDropdown && (
              <div className="grid grid-cols-3 gap-1.5 p-4">
                {MONTHS.map((month, i) => {
                  const isSelected =
                    selectedYear === viewYear && selectedMonth === i;
                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() => {
                        const mm = String(i + 1).padStart(2, "0");
                        onChange(`${viewYear}-${mm}`);
                        setOpen(false);
                        setShowYearDropdown(false);
                      }}
                      className="py-2.5 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg, #6366f1, #818cf8)"
                          : "transparent",
                        color: isSelected ? "#ffffff" : "#9090b0",
                        cursor: "pointer",
                        boxShadow: isSelected
                          ? "0 2px 12px rgba(99,102,241,0.4)"
                          : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background =
                            "rgba(99,102,241,0.15)";
                          e.currentTarget.style.color = "#ffffff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#9090b0";
                        }
                      }}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Clear */}
            {value && (
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  padding: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                  }}
                  className="w-full py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    color: "#505070",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f87171";
                    e.currentTarget.style.background = "rgba(248,113,113,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#505070";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Clear date
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Props {
  onNext: (data?: Record<string, any>) => void;
  onBack: () => void;
  data: Record<string, any>;
  dark: boolean;
  textPrimary: string;
  textMuted: string;
  border: string;
  isRevisit?: boolean;
}

const empty = (): Experience => ({
  id: Math.random().toString(36).slice(2),
  title: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
});

const toTitleCase = (str: string) =>
  str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Step4Experience({
  onNext,
  onBack,
  data,
  dark,
  textPrimary,
  textMuted,
  border,
  isRevisit,
}: Props) {
  const extracted = data?.extractedData || {};
  const saved = data?.experience;

  const [items, setItems] = useState<Experience[]>(
    saved && saved.length > 0 && saved.some((e: any) => e.title || e.company)
      ? saved
      : extracted.experience && extracted.experience.length > 0
        ? extracted.experience.map((e: any) => ({
            id: Math.random().toString(36).slice(2),
            title: e.title || "",
            company: e.company || "",
            location: e.location || "",
            startDate: e.startDate || "",
            endDate: e.endDate || "",
            current: e.current || false,
            description: e.description || "",
          }))
        : [empty()],
  );
  const [openId, setOpenId] = useState<string>(items[0]?.id || "");

  const inputBg = dark ? "rgba(255,255,255,0.05)" : "#ffffff";
  const cardBg = dark ? "#0e0e1a" : "#f5f5ff";

  const update = (id: string, k: string, v: any) =>
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, [k]: v } : e)));

  const add = () => {
    const n = empty();
    setItems((prev) => [...prev, n]);
    setOpenId(n.id);
  };

  const remove = (id: string) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((e) => e.id !== id));
    setOpenId(items.find((e) => e.id !== id)!.id);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            color: "#6366f1",
          }}
        >
          Step 4 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>
          Work experience
        </h1>
        <p className="text-base" style={{ color: textMuted }}>
          Add your work history. Start with your most recent position.
        </p>
      </motion.div>

      {/* Experience entries */}
      <div className="space-y-4 mb-6">
        {items.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden"
            style={{
              border: `1px solid ${openId === exp.id ? "#6366f1" : border}`,
            }}
          >
            {/* Accordion header */}
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
              style={{ background: cardBg }}
              onClick={() => setOpenId(openId === exp.id ? "" : exp.id)}
            >
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: textPrimary }}
                >
                  {exp.title || `Position ${i + 1}`}
                </div>
                {exp.company && (
                  <div className="text-xs mt-0.5" style={{ color: textMuted }}>
                    {exp.company}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(exp.id);
                    }}
                    className="text-xs px-2 py-1 rounded-lg cursor-pointer"
                    style={{
                      color: "#f87171",
                      background: "rgba(248,113,113,0.1)",
                    }}
                  >
                    Remove
                  </button>
                )}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    color: textMuted,
                    transform:
                      openId === exp.id ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.2s",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Accordion body */}
            <AnimatePresence>
              {openId === exp.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div
                    className="grid grid-cols-2 gap-4 p-5"
                    style={{ background: dark ? "#070711" : "#ffffff" }}
                  >
                    {/* Job Title */}
                    <div>
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                        style={{ color: textMuted }}
                      >
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) =>
                          update(exp.id, "title", toTitleCase(e.target.value))
                        }
                        placeholder="Software Developer"
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                        style={{
                          background: inputBg,
                          border: `1px solid ${border}`,
                          color: textPrimary,
                        }}
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                        style={{ color: textMuted }}
                      >
                        Company *
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          update(exp.id, "company", toTitleCase(e.target.value))
                        }
                        placeholder="Acme Corp"
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                        style={{
                          background: inputBg,
                          border: `1px solid ${border}`,
                          color: textPrimary,
                        }}
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                        style={{ color: textMuted }}
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) =>
                          update(
                            exp.id,
                            "location",
                            toTitleCase(e.target.value),
                          )
                        }
                        placeholder="Helsinki, Finland"
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                        style={{
                          background: inputBg,
                          border: `1px solid ${border}`,
                          color: textPrimary,
                        }}
                      />
                    </div>

                    {/* Spacer to keep grid aligned */}
                    <div />

                    {/* Start Date */}
                    <div>
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                        style={{ color: textMuted }}
                      >
                        Start Date
                      </label>
                      <MonthYearPicker
                        value={exp.startDate}
                        onChange={(val) => update(exp.id, "startDate", val)}
                        placeholder="Select start date"
                        inputBg={inputBg}
                        border={border}
                        textPrimary={textPrimary}
                        textMuted={textMuted}
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                        style={{ color: textMuted }}
                      >
                        End Date
                      </label>
                      <MonthYearPicker
                        value={exp.endDate}
                        onChange={(val) => update(exp.id, "endDate", val)}
                        placeholder="Select end date"
                        disabled={exp.current}
                        inputBg={inputBg}
                        border={border}
                        textPrimary={textPrimary}
                        textMuted={textMuted}
                      />
                    </div>

                    {/* Currently working here */}
                    <div className="col-span-2 flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) =>
                          update(exp.id, "current", e.target.checked)
                        }
                        className="w-4 h-4 cursor-pointer"
                        style={{ accentColor: "#6366f1" }}
                      />
                      <label
                        htmlFor={`current-${exp.id}`}
                        className="text-sm cursor-pointer"
                        style={{ color: textMuted }}
                      >
                        I currently work here
                      </label>
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                        style={{ color: textMuted }}
                      >
                        Description
                      </label>
                      <textarea
                        rows={4}
                        value={exp.description}
                        onChange={(e) =>
                          update(exp.id, "description", e.target.value)
                        }
                        placeholder="Key responsibilities and achievements…"
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none"
                        style={{
                          background: inputBg,
                          border: `1px solid ${border}`,
                          color: textPrimary,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Add more */}
      <button
        onClick={add}
        className="w-full py-3 rounded-xl text-sm font-medium cursor-pointer transition-all mb-8 flex items-center justify-center gap-2"
        style={{
          background: "transparent",
          border: `1px dashed ${border}`,
          color: textMuted,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add another position
      </button>

      {/* Nav */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{
            background: "transparent",
            border: `1px solid ${border}`,
            color: textMuted,
          }}
        >
          ← Back
        </button>
        <button
          onClick={() => (isRevisit ? onNext() : onNext({ experience: items }))}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: "#6366f1", color: "#ffffff" }}
        >
          {isRevisit ? "Next →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
