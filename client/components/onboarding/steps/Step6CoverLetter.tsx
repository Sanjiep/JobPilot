"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

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

const options = [
  {
    id: "manual",
    title: "Write my own",
    description: "Write your cover letter in the editor below",
    color: "#6366f1",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    id: "ai",
    title: "Generate with AI",
    description: "AI writes a professional cover letter from your CV data",
    color: "#a78bfa",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
        <path d="M9 13a4.5 4.5 0 0 0 3-4" />
        <path d="M12 13h4" />
        <path d="M12 18h6a2 2 0 0 1 2 2v1" />
        <path d="M12 8h8" />
        <path d="M16 8V5a2 2 0 0 1 2-2" />
        <circle cx="16" cy="13" r=".5" />
        <circle cx="18" cy="3" r=".5" />
        <circle cx="20" cy="21" r=".5" />
        <circle cx="20" cy="8" r=".5" />
      </svg>
    ),
  },
  {
    id: "per_job",
    title: "Generate per job",
    description: "AI writes a unique cover letter for each job application",
    color: "#34d399",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
];

const LANGUAGES = [
  "English",
  "Finnish",
  "Swedish",
  "Norwegian",
  "Danish",
  "German",
  "French",
  "Spanish",
  "Italian",
  "Dutch",
  "Portuguese",
  "Polish",
  "Russian",
  "Arabic",
  "Chinese",
  "Japanese",
  "Korean",
  "Hindi",
  "Turkish",
  "Nepali",
];

export default function Step6CoverLetter({
  onNext,
  onBack,
  data,
  dark,
  textPrimary,
  textMuted,
  border,
  isRevisit,
}: Props) {
  const [selected, setSelected] = useState<string | null>(
    data?.coverLetterSource || null,
  );
  const [content, setContent] = useState(data?.coverLetter || "");
  const [generating, setGenerating] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [selectedLang, setSelectedLang] = useState("Finnish");

  const inputBg = dark ? "rgba(255,255,255,0.05)" : "#ffffff";
  const cardBg = dark ? "#0e0e1a" : "#f5f5ff";

  const translateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        translateRef.current &&
        !translateRef.current.contains(e.target as Node)
      ) {
        setShowTranslate(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const buildProfile = () => {
    const p = data?.personal || {};
    const e = data?.extractedData || {};
    return {
      firstName: p.firstName || e.firstName || "",
      lastName: p.lastName || e.lastName || "",
      email: p.email || e.email || "",
      phone: p.phone || e.phone || "",
      city: p.city || e.city || "",
      country: p.country || e.country || "",
      summary: e.summary || "",
    };
  };

  const buildExperience = () => {
    const exp = data?.experience || [];
    const ext = data?.extractedData?.experience || [];
    const src =
      exp.length > 0 && exp.some((e: any) => e.title || e.company) ? exp : ext;
    return src.map((e: any) => ({
      title: e.title || "",
      company: e.company || "",
      location: e.location || "",
      description: e.description || "",
    }));
  };

  const buildSkills = () => {
    const tech = data?.technical || [];
    const ext = data?.extractedData?.technical || [];
    const src = tech.length > 0 && tech.some((t: any) => t.name) ? tech : ext;
    return src
      .map((s: any) => (typeof s === "string" ? s : s.name))
      .filter(Boolean);
  };

  const buildEducation = () => {
    const edu = data?.education || [];
    const ext = data?.extractedData?.education || [];
    const src = edu.length > 0 && edu.some((e: any) => e.degree) ? edu : ext;
    return src.map((e: any) => ({
      degree: e.degree || "",
      institution: e.institution || "",
    }));
  };

  const generateWithAI = async (): Promise<string> => {
    setGenerating(true);
    try {
      const profile = buildProfile();
      const experience = buildExperience();
      const skills = buildSkills();
      const education = buildEducation();
      const languages = (
        data?.languages ||
        data?.extractedData?.languages ||
        []
      )
        .map((l: any) => (typeof l === "string" ? l : l.name))
        .filter(Boolean);
      const certifications =
        data?.certifications || data?.extractedData?.certifications || "";

      const res = await api.post("/api/ai/cover-letter", {
        profile,
        experience,
        skills,
        education,
        languages,
        certifications,
        jobTitle: null,
        jobDescription: null,
        company: null,
      });
      const generated = res.data.data?.coverLetter || "";
      setContent(generated);
      return generated;
    } catch {
      const profile = buildProfile();
      const exp = buildExperience();
      const skills = buildSkills();
      const fallback = `Dear Hiring Manager,

I am ${profile.firstName} ${profile.lastName}, a dedicated professional based in ${profile.city}, ${profile.country}. ${profile.summary || "I am seeking new opportunities to contribute my skills and experience."}

${exp.length > 0 ? `In my previous role as ${exp[0].title} at ${exp[0].company}, I developed strong skills and a commitment to excellence.` : ""} ${skills.length > 0 ? `My key skills include ${skills.slice(0, 4).join(", ")}.` : ""}

I am eager to bring my dedication and experience to your team. I would welcome the opportunity to discuss how I can contribute to your organization.

Best regards,
${profile.firstName} ${profile.lastName}
${profile.email}
${profile.phone}`.trim();

      setContent(fallback);
      return fallback;
    } finally {
      setGenerating(false);
    }
  };

  const translateContent = async () => {
    if (!content) return;
    setTranslating(true);
    try {
      const res = await api.post("/api/ai/translate", {
        text: content,
        targetLanguage: selectedLang,
      });
      setContent(res.data.data?.translated || content);
    } catch {
      // silent fail
    } finally {
      setTranslating(false);
      setShowTranslate(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    if (selected === "per_job") {
      onNext({ coverLetter: "", coverLetterSource: "per_job" });
      return;
    }
    onNext({ coverLetter: content, coverLetterSource: selected || "manual" });
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
          Step 6 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>
          Cover letter
        </h1>
        <p className="text-base" style={{ color: textMuted }}>
          How would you like to handle cover letters for your applications?
        </p>
      </motion.div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {options.map((opt) => (
          <motion.div
            key={opt.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelected(opt.id)}
            className="flex items-center gap-4 rounded-2xl p-5 cursor-pointer transition-all"
            style={{
              background: selected === opt.id ? `${opt.color}10` : cardBg,
              border:
                selected === opt.id
                  ? `2px solid ${opt.color}`
                  : `1px solid ${border}`,
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${opt.color}15`, color: opt.color }}
            >
              {opt.icon}
            </div>
            <div className="flex-1">
              <div
                className="text-base font-semibold mb-0.5"
                style={{ color: textPrimary }}
              >
                {opt.title}
              </div>
              <div className="text-sm" style={{ color: textMuted }}>
                {opt.description}
              </div>
            </div>
            <div
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{
                borderColor: selected === opt.id ? opt.color : border,
                background: selected === opt.id ? opt.color : "transparent",
              }}
            >
              {selected === opt.id && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Per job note */}
      {selected === "per_job" && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl px-4 py-3 mb-6 flex items-start gap-3"
          style={{
            background: "rgba(52,211,153,0.08)",
            border: "1px solid rgba(52,211,153,0.2)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#34d399"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 mt-0.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm" style={{ color: textMuted }}>
            JobPilot will generate a tailored cover letter for each job based on
            the job description when applying. No action needed now.
          </p>
        </motion.div>
      )}

      {/* Editor for manual / ai */}
      <AnimatePresence>
        {(selected === "manual" || selected === "ai") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            {/* AI generate button */}
            {selected === "ai" && (
              <button
                onClick={generateWithAI}
                disabled={generating}
                className="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer mb-3 transition-all flex items-center justify-center gap-2"
                style={{
                  background: "rgba(167,139,250,0.1)",
                  border: "1px solid rgba(167,139,250,0.3)",
                  color: "#a78bfa",
                  opacity: generating ? 0.7 : 1,
                }}
              >
                {generating ? (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-spin"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Generating your cover letter…
                  </>
                ) : (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    {content ? "Regenerate with AI" : "Generate with AI"}
                  </>
                )}
              </button>
            )}

            {/* Toolbar — only show when content exists */}
            {content && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: textMuted }}>
                  {content.split(" ").filter(Boolean).length} words
                </span>
                <div className="flex items-center gap-2">
                  {/* Translate button */}
                  <div className="relative" ref={translateRef}>
                    <button
                      onClick={() => setShowTranslate((o) => !o)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
                      style={{
                        background: showTranslate
                          ? "rgba(56,189,248,0.15)"
                          : "transparent",
                        border: `1px solid ${showTranslate ? "rgba(56,189,248,0.4)" : border}`,
                        color: showTranslate ? "#38bdf8" : textMuted,
                      }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      Translate
                    </button>

                    {/* Translate dropdown */}
                    <AnimatePresence>
                      {showTranslate && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.97 }}
                          transition={{ duration: 0.12 }}
                          className="absolute right-0 top-full mt-1 z-50 rounded-xl overflow-hidden shadow-2xl"
                          style={{
                            width: "200px",
                            background: dark ? "#0e0e1a" : "#ffffff",
                            border: `1px solid ${border}`,
                            boxShadow: dark
                              ? "0 8px 32px rgba(0,0,0,0.5)"
                              : "0 8px 32px rgba(0,0,0,0.12)",
                          }}
                        >
                          <div className="p-2 max-h-48 overflow-y-auto">
                            {LANGUAGES.map((lang) => (
                              <button
                                key={lang}
                                onClick={() => setSelectedLang(lang)}
                                className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all"
                                style={{
                                  background:
                                    selectedLang === lang
                                      ? "rgba(56,189,248,0.15)"
                                      : "transparent",
                                  color:
                                    selectedLang === lang
                                      ? "#38bdf8"
                                      : textPrimary,
                                  fontWeight: selectedLang === lang ? 600 : 400,
                                }}
                                onMouseEnter={(e) => {
                                  if (selectedLang !== lang)
                                    e.currentTarget.style.background = dark
                                      ? "rgba(255,255,255,0.05)"
                                      : "#f5f5ff";
                                }}
                                onMouseLeave={(e) => {
                                  if (selectedLang !== lang)
                                    e.currentTarget.style.background =
                                      "transparent";
                                }}
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                          <div
                            className="p-2 border-t"
                            style={{ borderColor: border }}
                          >
                            <button
                              onClick={translateContent}
                              disabled={translating}
                              className="w-full py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                              style={{
                                background: "#38bdf8",
                                color: "#ffffff",
                                opacity: translating ? 0.7 : 1,
                              }}
                            >
                              {translating ? (
                                <>
                                  <svg
                                    width="11"
                                    height="11"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="animate-spin"
                                  >
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                  </svg>
                                  Translating…
                                </>
                              ) : (
                                `Translate to ${selectedLang}`
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
                    style={{
                      background: copied
                        ? "rgba(52,211,153,0.15)"
                        : "transparent",
                      border: `1px solid ${copied ? "rgba(52,211,153,0.4)" : border}`,
                      color: copied ? "#34d399" : textMuted,
                    }}
                  >
                    {copied ? (
                      <>
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
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Textarea */}
            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                "Dear Hiring Manager,\n\nI am writing to express my interest in…"
              }
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
              style={{
                background: inputBg,
                border: `1px solid ${border}`,
                color: textPrimary,
                lineHeight: "1.7",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
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
          onClick={handleContinue}
          disabled={!isRevisit && (!selected || generating)}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all flex items-center justify-center gap-2"
          style={{
            background: isRevisit || selected ? "#6366f1" : border,
            color: isRevisit || selected ? "#ffffff" : textMuted,
            opacity: generating ? 0.7 : 1,
          }}
        >
          {generating ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Generating…
            </>
          ) : isRevisit ? (
            "Next →"
          ) : (
            "Continue →"
          )}
        </button>
      </div>
    </div>
  );
}
