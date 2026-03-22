"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomSelect from "@/components/ui/CustomSelector";

interface Props {
  onNext: (data?: Record<string, any>) => void;
  onBack: () => void;
  data: Record<string, any>;
  dark: boolean;
  textPrimary: string;
  textMuted: string;
  border: string;
}

const ALL_TECHNICAL = [
  // Programming & Web
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "C",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Svelte",
  "Node.js",
  "Express",
  "Django",
  "FastAPI",
  "Flask",
  "Spring Boot",
  "Laravel",
  "Ruby on Rails",
  ".NET",
  "ASP.NET",
  // Data & AI
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Elasticsearch",
  "GraphQL",
  "REST APIs",
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "Data Analysis",
  "Data Visualization",
  "Tableau",
  "Power BI",
  "Excel",
  "R",
  // Cloud & DevOps
  "AWS",
  "Google Cloud",
  "Azure",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Git",
  "Linux",
  "Bash",
  "Terraform",
  "Firebase",
  // Design & Other
  "Figma",
  "Adobe XD",
  "Photoshop",
  "Illustrator",
  "Tailwind CSS",
  "SASS",
  "UI/UX Design",
  "AutoCAD",
  "SolidWorks",
  "MATLAB",
  "LabVIEW",
  // Business & Finance
  "SAP",
  "Salesforce",
  "HubSpot",
  "Jira",
  "Confluence",
  "Microsoft Office",
  "Google Workspace",
  "QuickBooks",
  "Xero",
  "Financial Modeling",
  "Business Analysis",
  // Healthcare & Science
  "Electronic Health Records",
  "Medical Coding",
  "Clinical Research",
  "SPSS",
  "Laboratory Techniques",
  // Trades & Engineering
  "PLC Programming",
  "Electrical Wiring",
  "Welding",
  "CNC Machining",
  "Project Management",
  "Quality Assurance",
  "Six Sigma",
  "Lean Manufacturing",
  // Marketing & Media
  "SEO",
  "Google Ads",
  "Social Media Marketing",
  "Content Writing",
  "Copywriting",
  "Video Editing",
  "Adobe Premiere",
  "Final Cut Pro",
  "Photography",
];

const ALL_SOFT = [
  "Communication",
  "Leadership",
  "Problem Solving",
  "Teamwork",
  "Time Management",
  "Adaptability",
  "Critical Thinking",
  "Creativity",
  "Conflict Resolution",
  "Emotional Intelligence",
  "Decision Making",
  "Mentoring",
  "Negotiation",
  "Public Speaking",
  "Project Management",
  "Attention to Detail",
  "Self-Motivation",
  "Work Ethic",
  "Active Listening",
  "Empathy",
  "Collaboration",
  "Flexibility",
  "Stress Management",
  "Customer Service",
  "Sales",
  "Presentation Skills",
];

const SUGGESTED_TECHNICAL = [
  "Microsoft Office",
  "Project Management",
  "Data Analysis",
  "Customer Service",
  "JavaScript",
  "Python",
  "SQL",
  "Figma",
  "SEO",
  "Salesforce",
];

const SUGGESTED_SOFT = [
  "Communication",
  "Leadership",
  "Problem Solving",
  "Teamwork",
  "Time Management",
  "Adaptability",
];

const ALL_LANGUAGES = [
  "Afrikaans",
  "Albanian",
  "Amharic",
  "Arabic",
  "Armenian",
  "Azerbaijani",
  "Basque",
  "Belarusian",
  "Bengali",
  "Bosnian",
  "Bulgarian",
  "Catalan",
  "Cebuano",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "English",
  "Esperanto",
  "Estonian",
  "Filipino",
  "Finnish",
  "French",
  "Frisian",
  "Galician",
  "Georgian",
  "German",
  "Greek",
  "Gujarati",
  "Haitian Creole",
  "Hausa",
  "Hawaiian",
  "Hebrew",
  "Hindi",
  "Hungarian",
  "Icelandic",
  "Igbo",
  "Indonesian",
  "Irish",
  "Italian",
  "Japanese",
  "Javanese",
  "Kannada",
  "Kazakh",
  "Khmer",
  "Korean",
  "Kurdish",
  "Lao",
  "Latin",
  "Latvian",
  "Lithuanian",
  "Luxembourgish",
  "Macedonian",
  "Malagasy",
  "Malay",
  "Malayalam",
  "Maltese",
  "Maori",
  "Marathi",
  "Mongolian",
  "Myanmar (Burmese)",
  "Nepali",
  "Norwegian",
  "Pashto",
  "Persian",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Romanian",
  "Russian",
  "Samoan",
  "Serbian",
  "Sindhi",
  "Sinhala",
  "Slovak",
  "Slovenian",
  "Somali",
  "Spanish",
  "Sundanese",
  "Swahili",
  "Swedish",
  "Tajik",
  "Tamil",
  "Telugu",
  "Thai",
  "Turkish",
  "Ukrainian",
  "Urdu",
  "Uzbek",
  "Vietnamese",
  "Welsh",
  "Xhosa",
  "Yiddish",
  "Yoruba",
  "Zulu",
];

const LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Native",
];

interface Tag {
  id: string;
  name: string;
  level?: string;
}

// Tag Badge
const TagBadge = ({
  tag,
  onRemove,
  color = "#6366f1",
}: {
  tag: Tag;
  onRemove: () => void;
  color?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
    style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}
  >
    {tag.name}
    <button
      onClick={onRemove}
      className="cursor-pointer hover:opacity-70 ml-0.5 text-sm leading-none"
    >
      ×
    </button>
  </motion.div>
);

// Autocomplete Input
function AutocompleteInput({
  value,
  onChange,
  onAdd,
  placeholder,
  suggestions,
  inputBg,
  border,
  textPrimary,
  textMuted,
  accentColor = "#6366f1",
  buttonStyle,
}: {
  value: string;
  onChange: (v: string) => void;
  onAdd: (v: string) => void;
  placeholder: string;
  suggestions: string[];
  inputBg: string;
  border: string;
  textPrimary: string;
  textMuted: string;
  accentColor?: string;
  buttonStyle?: React.CSSProperties;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered =
    value.trim().length > 0
      ? suggestions
          .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 7)
      : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setHighlighted(-1);
  }, [value]);

  const commit = (val: string) => {
    onAdd(val);
    onChange("");
    setShowDropdown(false);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlighted >= 0 && filtered[highlighted])
        commit(filtered[highlighted]);
      else if (value.trim()) commit(value.trim());
    } else if (e.key === "Escape") setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className="flex gap-2 relative">
      <div className="flex-1 relative">
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{
            background: inputBg,
            border: `1px solid ${border}`,
            color: textPrimary,
          }}
          autoComplete="off"
        />
        <AnimatePresence>
          {showDropdown && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute z-50 w-full rounded-xl overflow-hidden shadow-2xl mt-1"
              style={{
                background: "#0e0e1a",
                border: `1px solid ${accentColor}40`,
              }}
            >
              {filtered.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={() => commit(s)}
                  className="w-full px-4 py-2.5 text-sm text-left transition-all"
                  style={{
                    background:
                      highlighted === i ? `${accentColor}20` : "transparent",
                    color: highlighted === i ? "#ffffff" : "#9090b0",
                    cursor: "pointer",
                    borderBottom:
                      i < filtered.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${accentColor}15`;
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      highlighted === i ? `${accentColor}20` : "transparent";
                    e.currentTarget.style.color =
                      highlighted === i ? "#ffffff" : "#9090b0";
                  }}
                >
                  {(() => {
                    const idx = s.toLowerCase().indexOf(value.toLowerCase());
                    if (idx === -1) return s;
                    return (
                      <>
                        {s.slice(0, idx)}
                        <span style={{ color: accentColor, fontWeight: 700 }}>
                          {s.slice(idx, idx + value.length)}
                        </span>
                        {s.slice(idx + value.length)}
                      </>
                    );
                  })()}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={() => {
          if (value.trim()) commit(value.trim());
        }}
        className="px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
        style={buttonStyle ?? { background: accentColor, color: "#ffffff" }}
      >
        Add
      </button>
    </div>
  );
}

// Main Component
export default function Step5Skills({
  onNext,
  onBack,
  data,
  dark,
  textPrimary,
  textMuted,
  border,
}: Props) {
  const [technical, setTechnical] = useState<Tag[]>(data?.technical ?? []);
  const [soft, setSoft] = useState<Tag[]>(data?.soft ?? []);
  const [languages, setLanguages] = useState<Tag[]>(data?.languages ?? []);
  const [techInput, setTechInput] = useState("");
  const [softInput, setSoftInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [certs, setCerts] = useState(data?.certifications ?? "");

  const inputBg = dark ? "rgba(255,255,255,0.05)" : "#ffffff";
  const cardBg = dark ? "#0e0e1a" : "#f5f5ff";

  const addTag = (list: Tag[], setList: (t: Tag[]) => void, name: string) => {
    if (
      !name.trim() ||
      list.find((t) => t.name.toLowerCase() === name.toLowerCase())
    )
      return;
    setList([
      ...list,
      { id: Math.random().toString(36).slice(2), name: name.trim() },
    ]);
  };

  const removeTag = (list: Tag[], setList: (t: Tag[]) => void, id: string) =>
    setList(list.filter((t) => t.id !== id));

  const addLanguage = (name: string) => {
    if (
      !name.trim() ||
      languages.find((l) => l.name.toLowerCase() === name.toLowerCase())
    )
      return;
    setLanguages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        name: name.trim(),
        level: "Intermediate",
      },
    ]);
  };

  const updateLevel = (id: string, level: string) =>
    setLanguages(languages.map((l) => (l.id === id ? { ...l, level } : l)));

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
          Step 5 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>
          Skills & languages
        </h1>
        <p className="text-base" style={{ color: textMuted }}>
          Add your skills and languages to get better job matches.
        </p>
      </motion.div>

      <div className="space-y-6 mb-8">
        {/* Technical / Hard Skills */}
        <div
          className="rounded-2xl p-5"
          style={{ background: cardBg, border: `1px solid ${border}` }}
        >
          <div
            className="text-sm font-bold mb-1"
            style={{ color: textPrimary }}
          >
            Hard Skills
          </div>
          <div className="text-xs mb-3" style={{ color: textMuted }}>
            Tools, software, technical abilities — any field
          </div>
          <AutocompleteInput
            value={techInput}
            onChange={setTechInput}
            onAdd={(v) => addTag(technical, setTechnical, v)}
            placeholder="e.g. Excel, Welding, Python, Photoshop…"
            suggestions={ALL_TECHNICAL.filter(
              (s) => !technical.find((t) => t.name === s),
            )}
            inputBg={inputBg}
            border={border}
            textPrimary={textPrimary}
            textMuted={textMuted}
            accentColor="#6366f1"
          />
          <AnimatePresence>
            <div className="flex flex-wrap gap-2 mt-3 mb-3">
              {technical.map((t) => (
                <TagBadge
                  key={t.id}
                  tag={t}
                  onRemove={() => removeTag(technical, setTechnical, t.id)}
                />
              ))}
            </div>
          </AnimatePresence>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TECHNICAL.filter(
              (s) => !technical.find((t) => t.name === s),
            ).map((s) => (
              <button
                key={s}
                onClick={() => addTag(technical, setTechnical, s)}
                className="px-3 py-1 rounded-full text-xs cursor-pointer transition-all"
                style={{
                  background: "transparent",
                  border: `1px solid ${border}`,
                  color: textMuted,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.color = "#6366f1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.color = textMuted;
                }}
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div
          className="rounded-2xl p-5"
          style={{ background: cardBg, border: `1px solid ${border}` }}
        >
          <div
            className="text-sm font-bold mb-1"
            style={{ color: textPrimary }}
          >
            Soft Skills
          </div>
          <div className="text-xs mb-3" style={{ color: textMuted }}>
            Interpersonal and workplace skills
          </div>
          <AutocompleteInput
            value={softInput}
            onChange={setSoftInput}
            onAdd={(v) => addTag(soft, setSoft, v)}
            placeholder="e.g. Leadership, Communication…"
            suggestions={ALL_SOFT.filter(
              (s) => !soft.find((t) => t.name === s),
            )}
            inputBg={inputBg}
            border={border}
            textPrimary={textPrimary}
            textMuted={textMuted}
            accentColor="#a78bfa"
            buttonStyle={{
              background: "rgba(167,139,250,0.15)",
              color: "#a78bfa",
              border: "1px solid rgba(167,139,250,0.3)",
            }}
          />
          <AnimatePresence>
            <div className="flex flex-wrap gap-2 mt-3 mb-3">
              {soft.map((t) => (
                <TagBadge
                  key={t.id}
                  tag={t}
                  color="#a78bfa"
                  onRemove={() => removeTag(soft, setSoft, t.id)}
                />
              ))}
            </div>
          </AnimatePresence>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SOFT.filter((s) => !soft.find((t) => t.name === s)).map(
              (s) => (
                <button
                  key={s}
                  onClick={() => addTag(soft, setSoft, s)}
                  className="px-3 py-1 rounded-full text-xs cursor-pointer transition-all"
                  style={{
                    background: "transparent",
                    border: `1px solid ${border}`,
                    color: textMuted,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#a78bfa";
                    e.currentTarget.style.color = "#a78bfa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = border;
                    e.currentTarget.style.color = textMuted;
                  }}
                >
                  + {s}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Languages */}
        <div
          className="rounded-2xl p-5"
          style={{ background: cardBg, border: `1px solid ${border}` }}
        >
          <div
            className="text-sm font-bold mb-1"
            style={{ color: textPrimary }}
          >
            Languages
          </div>
          <div className="text-xs mb-3" style={{ color: textMuted }}>
            Search from 80+ languages or type any custom one
          </div>
          <AutocompleteInput
            value={langInput}
            onChange={setLangInput}
            onAdd={addLanguage}
            placeholder="Search language e.g. Finnish, Arabic…"
            suggestions={ALL_LANGUAGES.filter(
              (l) => !languages.find((e) => e.name === l),
            )}
            inputBg={inputBg}
            border={border}
            textPrimary={textPrimary}
            textMuted={textMuted}
            accentColor="#38bdf8"
            buttonStyle={{
              background: "rgba(56,189,248,0.15)",
              color: "#38bdf8",
              border: "1px solid rgba(56,189,248,0.3)",
            }}
          />

          {/* Quick toggles — common ones not yet added */}
          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            {[
              "English",
              "Finnish",
              "Swedish",
              "German",
              "French",
              "Spanish",
              "Arabic",
              "Mandarin",
            ]
              .filter((l) => !languages.find((e) => e.name === l))
              .map((lang) => (
                <button
                  key={lang}
                  onClick={() => addLanguage(lang)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all"
                  style={{
                    background: "transparent",
                    border: `1px solid ${border}`,
                    color: textMuted,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#38bdf8";
                    e.currentTarget.style.color = "#38bdf8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = border;
                    e.currentTarget.style.color = textMuted;
                  }}
                >
                  + {lang}
                </button>
              ))}
          </div>

          {/* Added languages with level */}
          <AnimatePresence>
            {languages.map((lang) => (
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-3 mb-2"
              >
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(56,189,248,0.1)",
                    border: "1px solid rgba(56,189,248,0.25)",
                    color: "#38bdf8",
                    minWidth: "110px",
                  }}
                >
                  {lang.name}
                  <button
                    onClick={() =>
                      setLanguages((prev) =>
                        prev.filter((l) => l.id !== lang.id),
                      )
                    }
                    className="cursor-pointer hover:opacity-70 ml-auto text-sm leading-none"
                  >
                    ×
                  </button>
                </div>

                <CustomSelect
                  value={lang.level ?? "Intermediate"}
                  onChange={(v) => updateLevel(lang.id, v)}
                  options={LEVELS}
                  label="Proficiency Level"
                  dark={dark}
                  textPrimary={textPrimary}
                  textMuted={textMuted}
                  border={border}
                  accentColor="#38bdf8"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Certifications */}
        <div
          className="rounded-2xl p-5"
          style={{ background: cardBg, border: `1px solid ${border}` }}
        >
          <div
            className="text-sm font-bold mb-1"
            style={{ color: textPrimary }}
          >
            Certifications{" "}
            <span className="font-normal" style={{ color: textMuted }}>
              (optional)
            </span>
          </div>
          <div className="text-xs mb-3" style={{ color: textMuted }}>
            Any field — IT, finance, health, trades, etc.
          </div>
          <textarea
            rows={3}
            value={certs}
            onChange={(e) => setCerts(e.target.value)}
            placeholder="e.g. AWS Solutions Architect, PMP, First Aid, IELTS 7.5…"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
            style={{
              background: inputBg,
              border: `1px solid ${border}`,
              color: textPrimary,
            }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer"
          style={{
            background: "transparent",
            border: `1px solid ${border}`,
            color: textMuted,
          }}
        >
          ← Back
        </button>
        <button
          onClick={() =>
            onNext({ technical, soft, languages, certifications: certs })
          }
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer"
          style={{ background: "#6366f1", color: "#ffffff" }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
