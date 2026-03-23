"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import CustomSelect from "@/components/ui/CustomSelector";

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

interface Link {
  id: string;
  platform: string;
  url: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  links: Link[];
  photoUrl: string;
}

const PLATFORMS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/yourprofile",
    color: "#0077b5",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    id: "github",
    label: "GitHub",
    placeholder: "https://github.com/username",
    color: "#e0e0e0",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    id: "portfolio",
    label: "Portfolio",
    placeholder: "https://yoursite.com",
    color: "#6366f1",
    icon: (
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
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: "twitter",
    label: "X / Twitter",
    placeholder: "https://x.com/username",
    color: "#1da1f2",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632z" />
      </svg>
    ),
  },
  {
    id: "behance",
    label: "Behance",
    placeholder: "https://behance.net/username",
    color: "#1769ff",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.443 5.35c.639 0 1.23.05 1.77.198.541.099.984.297 1.377.544.394.247.689.594.885 1.039.197.445.296.99.296 1.583 0 .693-.148 1.286-.492 1.731-.296.445-.788.84-1.377 1.138.836.248 1.475.694 1.869 1.336.394.643.59 1.385.59 2.226 0 .693-.148 1.287-.394 1.781-.246.495-.639.94-1.082 1.237-.443.347-.984.594-1.574.742-.59.148-1.18.247-1.82.247H0V5.35h7.443zm-.394 5.54c.541 0 .984-.148 1.328-.395.344-.247.492-.693.492-1.237 0-.297-.049-.594-.148-.792-.099-.247-.247-.395-.394-.544-.197-.148-.394-.247-.639-.296-.246-.05-.492-.099-.787-.099H3.05V10.89h4.001zm.196 5.886c.295 0 .59-.05.836-.099.245-.05.491-.148.688-.297.196-.148.344-.346.492-.594.098-.247.197-.594.197-.99 0-.742-.197-1.286-.59-1.583-.394-.297-.935-.445-1.574-.445H3.05v4.008h4.197zm10.909-1.138c.393.396.983.594 1.77.594.541 0 1.033-.148 1.426-.395.393-.296.639-.594.737-.891h2.607c-.393 1.237-1.033 2.127-1.869 2.67-.836.545-1.869.792-3.05.792-.836 0-1.573-.148-2.262-.395-.689-.247-1.23-.643-1.721-1.089-.492-.495-.836-1.04-1.082-1.731-.246-.643-.394-1.385-.394-2.177 0-.792.148-1.484.394-2.177.246-.643.639-1.237 1.082-1.731.492-.495 1.033-.891 1.721-1.138.64-.248 1.377-.396 2.164-.396.886 0 1.672.198 2.312.594.64.396 1.18.89 1.574 1.534.393.643.688 1.336.836 2.127.099.742.148 1.534.099 2.325H17.57c.05.89.295 1.534.689 1.88zm3.098-5.14c-.344-.346-.885-.544-1.574-.544-.443 0-.836.099-1.131.247-.295.148-.541.346-.737.594-.197.247-.296.445-.344.693-.05.198-.099.445-.099.594h4.689c-.099-.742-.394-1.237-.738-1.583zm-5.378-5.294h5.575v1.534h-5.575V5.35z" />
      </svg>
    ),
  },
  {
    id: "dribbble",
    label: "Dribbble",
    placeholder: "https://dribbble.com/username",
    color: "#ea4c89",
    icon: (
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
        <circle cx="12" cy="12" r="10" />
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
      </svg>
    ),
  },
  {
    id: "other",
    label: "Other",
    placeholder: "https://",
    color: "#9090b0",
    icon: (
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
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
];

function detectPlatform(url: string): string {
  if (!url) return "other";
  if (url.includes("linkedin.com")) return "linkedin";
  if (url.includes("github.com")) return "github";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  if (url.includes("behance.net")) return "behance";
  if (url.includes("dribbble.com")) return "dribbble";
  return "portfolio";
}

function makeEmptyLink(): Link {
  return {
    id: Math.random().toString(36).slice(2),
    platform: "portfolio",
    url: "",
  };
}

// ─── Nationality Select ───────────────────────────────────────────────────────
const NATIONALITIES = [
  { code: "AF", name: "Afghan" },
  { code: "AL", name: "Albanian" },
  { code: "DZ", name: "Algerian" },
  { code: "AD", name: "Andorran" },
  { code: "AO", name: "Angolan" },
  { code: "AG", name: "Antiguan" },
  { code: "AR", name: "Argentine" },
  { code: "AM", name: "Armenian" },
  { code: "AU", name: "Australian" },
  { code: "AT", name: "Austrian" },
  { code: "AZ", name: "Azerbaijani" },
  { code: "BS", name: "Bahamian" },
  { code: "BH", name: "Bahraini" },
  { code: "BD", name: "Bangladeshi" },
  { code: "BB", name: "Barbadian" },
  { code: "BY", name: "Belarusian" },
  { code: "BE", name: "Belgian" },
  { code: "BZ", name: "Belizean" },
  { code: "BJ", name: "Beninese" },
  { code: "BT", name: "Bhutanese" },
  { code: "BO", name: "Bolivian" },
  { code: "BA", name: "Bosnian" },
  { code: "BW", name: "Botswanan" },
  { code: "BR", name: "Brazilian" },
  { code: "BN", name: "Bruneian" },
  { code: "BG", name: "Bulgarian" },
  { code: "BF", name: "Burkinabe" },
  { code: "BI", name: "Burundian" },
  { code: "CV", name: "Cape Verdean" },
  { code: "KH", name: "Cambodian" },
  { code: "CM", name: "Cameroonian" },
  { code: "CA", name: "Canadian" },
  { code: "CF", name: "Central African" },
  { code: "TD", name: "Chadian" },
  { code: "CL", name: "Chilean" },
  { code: "CN", name: "Chinese" },
  { code: "CO", name: "Colombian" },
  { code: "KM", name: "Comorian" },
  { code: "CG", name: "Congolese" },
  { code: "CR", name: "Costa Rican" },
  { code: "HR", name: "Croatian" },
  { code: "CU", name: "Cuban" },
  { code: "CY", name: "Cypriot" },
  { code: "CZ", name: "Czech" },
  { code: "DK", name: "Danish" },
  { code: "DJ", name: "Djiboutian" },
  { code: "DM", name: "Dominican" },
  { code: "DO", name: "Dominican (Rep)" },
  { code: "EC", name: "Ecuadorian" },
  { code: "EG", name: "Egyptian" },
  { code: "SV", name: "Salvadoran" },
  { code: "GQ", name: "Equatoguinean" },
  { code: "ER", name: "Eritrean" },
  { code: "EE", name: "Estonian" },
  { code: "SZ", name: "Swazi" },
  { code: "ET", name: "Ethiopian" },
  { code: "FJ", name: "Fijian" },
  { code: "FI", name: "Finnish" },
  { code: "FR", name: "French" },
  { code: "GA", name: "Gabonese" },
  { code: "GM", name: "Gambian" },
  { code: "GE", name: "Georgian" },
  { code: "DE", name: "German" },
  { code: "GH", name: "Ghanaian" },
  { code: "GR", name: "Greek" },
  { code: "GD", name: "Grenadian" },
  { code: "GT", name: "Guatemalan" },
  { code: "GN", name: "Guinean" },
  { code: "GW", name: "Guinea-Bissauan" },
  { code: "GY", name: "Guyanese" },
  { code: "HT", name: "Haitian" },
  { code: "HN", name: "Honduran" },
  { code: "HU", name: "Hungarian" },
  { code: "IS", name: "Icelandic" },
  { code: "IN", name: "Indian" },
  { code: "ID", name: "Indonesian" },
  { code: "IR", name: "Iranian" },
  { code: "IQ", name: "Iraqi" },
  { code: "IE", name: "Irish" },
  { code: "IL", name: "Israeli" },
  { code: "IT", name: "Italian" },
  { code: "JM", name: "Jamaican" },
  { code: "JP", name: "Japanese" },
  { code: "JO", name: "Jordanian" },
  { code: "KZ", name: "Kazakhstani" },
  { code: "KE", name: "Kenyan" },
  { code: "KI", name: "I-Kiribati" },
  { code: "KP", name: "North Korean" },
  { code: "KR", name: "South Korean" },
  { code: "KW", name: "Kuwaiti" },
  { code: "KG", name: "Kyrgyz" },
  { code: "LA", name: "Laotian" },
  { code: "LV", name: "Latvian" },
  { code: "LB", name: "Lebanese" },
  { code: "LS", name: "Basotho" },
  { code: "LR", name: "Liberian" },
  { code: "LY", name: "Libyan" },
  { code: "LI", name: "Liechtensteiner" },
  { code: "LT", name: "Lithuanian" },
  { code: "LU", name: "Luxembourgish" },
  { code: "MG", name: "Malagasy" },
  { code: "MW", name: "Malawian" },
  { code: "MY", name: "Malaysian" },
  { code: "MV", name: "Maldivian" },
  { code: "ML", name: "Malian" },
  { code: "MT", name: "Maltese" },
  { code: "MH", name: "Marshallese" },
  { code: "MR", name: "Mauritanian" },
  { code: "MU", name: "Mauritian" },
  { code: "MX", name: "Mexican" },
  { code: "FM", name: "Micronesian" },
  { code: "MD", name: "Moldovan" },
  { code: "MC", name: "Monegasque" },
  { code: "MN", name: "Mongolian" },
  { code: "ME", name: "Montenegrin" },
  { code: "MA", name: "Moroccan" },
  { code: "MZ", name: "Mozambican" },
  { code: "MM", name: "Burmese" },
  { code: "NA", name: "Namibian" },
  { code: "NR", name: "Nauruan" },
  { code: "NP", name: "Nepali" },
  { code: "NL", name: "Dutch" },
  { code: "NZ", name: "New Zealander" },
  { code: "NI", name: "Nicaraguan" },
  { code: "NE", name: "Nigerien" },
  { code: "NG", name: "Nigerian" },
  { code: "MK", name: "Macedonian" },
  { code: "NO", name: "Norwegian" },
  { code: "OM", name: "Omani" },
  { code: "PK", name: "Pakistani" },
  { code: "PW", name: "Palauan" },
  { code: "PA", name: "Panamanian" },
  { code: "PG", name: "Papua New Guinean" },
  { code: "PY", name: "Paraguayan" },
  { code: "PE", name: "Peruvian" },
  { code: "PH", name: "Filipino" },
  { code: "PL", name: "Polish" },
  { code: "PT", name: "Portuguese" },
  { code: "QA", name: "Qatari" },
  { code: "RO", name: "Romanian" },
  { code: "RU", name: "Russian" },
  { code: "RW", name: "Rwandan" },
  { code: "KN", name: "Kittitian" },
  { code: "LC", name: "Saint Lucian" },
  { code: "VC", name: "Vincentian" },
  { code: "WS", name: "Samoan" },
  { code: "SM", name: "Sammarinese" },
  { code: "ST", name: "São Toméan" },
  { code: "SA", name: "Saudi" },
  { code: "SN", name: "Senegalese" },
  { code: "RS", name: "Serbian" },
  { code: "SC", name: "Seychellois" },
  { code: "SL", name: "Sierra Leonean" },
  { code: "SG", name: "Singaporean" },
  { code: "SK", name: "Slovak" },
  { code: "SI", name: "Slovenian" },
  { code: "SB", name: "Solomon Islander" },
  { code: "SO", name: "Somali" },
  { code: "ZA", name: "South African" },
  { code: "SS", name: "South Sudanese" },
  { code: "ES", name: "Spanish" },
  { code: "LK", name: "Sri Lankan" },
  { code: "SD", name: "Sudanese" },
  { code: "SR", name: "Surinamese" },
  { code: "SE", name: "Swedish" },
  { code: "CH", name: "Swiss" },
  { code: "SY", name: "Syrian" },
  { code: "TW", name: "Taiwanese" },
  { code: "TJ", name: "Tajik" },
  { code: "TZ", name: "Tanzanian" },
  { code: "TH", name: "Thai" },
  { code: "TL", name: "Timorese" },
  { code: "TG", name: "Togolese" },
  { code: "TO", name: "Tongan" },
  { code: "TT", name: "Trinidadian" },
  { code: "TN", name: "Tunisian" },
  { code: "TR", name: "Turkish" },
  { code: "TM", name: "Turkmen" },
  { code: "TV", name: "Tuvaluan" },
  { code: "UG", name: "Ugandan" },
  { code: "UA", name: "Ukrainian" },
  { code: "AE", name: "Emirati" },
  { code: "GB", name: "British" },
  { code: "US", name: "American" },
  { code: "UY", name: "Uruguayan" },
  { code: "UZ", name: "Uzbek" },
  { code: "VU", name: "Vanuatuan" },
  { code: "VE", name: "Venezuelan" },
  { code: "VN", name: "Vietnamese" },
  { code: "YE", name: "Yemeni" },
  { code: "ZM", name: "Zambian" },
  { code: "ZW", name: "Zimbabwean" },
];

function NationalitySelect({
  value,
  onChange,
  inputBg,
  border,
  textPrimary,
  textMuted,
  dark,
}: {
  value: string;
  onChange: (v: string) => void;
  inputBg: string;
  border: string;
  textPrimary: string;
  textMuted: string;
  dark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filtered = search.trim()
    ? NATIONALITIES.filter((n) =>
        n.name.toLowerCase().includes(search.toLowerCase()),
      )
    : NATIONALITIES;
  const selected = NATIONALITIES.find((n) => n.name === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={{
          background: inputBg,
          border: `1px solid ${open ? "#6366f1" : border}`,
          color: selected ? textPrimary : textMuted,
          cursor: "pointer",
          boxShadow: open ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
          textAlign: "left",
        }}
      >
        <span className="flex items-center gap-2">
          {selected ? (
            <>
              <img
                src={`https://flagcdn.com/24x18/${selected.code.toLowerCase()}.png`}
                alt={selected.name}
                style={{
                  width: "20px",
                  height: "15px",
                  objectFit: "cover",
                  borderRadius: "2px",
                }}
              />
              {selected.name}
            </>
          ) : (
            "Select nationality"
          )}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            color: textMuted,
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.15s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-50 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            top: "calc(100% + 8px)",
            left: 0,
            width: "100%",
            background: dark ? "#0e0e1a" : "#ffffff",
            border: "1px solid rgba(99,102,241,0.25)",
            boxShadow: dark
              ? "0 8px 40px rgba(0,0,0,0.5)"
              : "0 8px 40px rgba(0,0,0,0.12)",
          }}
        >
          <div
            className="p-2"
            style={{
              borderBottom: `1px solid ${dark ? "#1e1e32" : "#e2e4f0"}`,
            }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{
                background: dark ? "rgba(255,255,255,0.05)" : "#f5f5ff",
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
                style={{ color: textMuted, flexShrink: 0 }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search nationality…"
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: textPrimary }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  style={{
                    color: textMuted,
                    cursor: "pointer",
                    fontSize: "16px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "220px" }}>
            {filtered.length === 0 ? (
              <div
                className="px-4 py-6 text-sm text-center"
                style={{ color: textMuted }}
              >
                No results for "{search}"
              </div>
            ) : (
              filtered.map((n) => {
                const isSelected = n.name === value;
                return (
                  <button
                    key={n.code}
                    type="button"
                    onClick={() => {
                      onChange(n.name);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                    style={{
                      background: isSelected
                        ? "rgba(99,102,241,0.1)"
                        : "transparent",
                      color: isSelected ? "#6366f1" : textPrimary,
                      fontWeight: isSelected ? 600 : 400,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.background = dark
                          ? "rgba(255,255,255,0.04)"
                          : "#f5f5ff";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <img
                      src={`https://flagcdn.com/24x18/${n.code.toLowerCase()}.png`}
                      alt={n.name}
                      style={{
                        width: "20px",
                        height: "15px",
                        objectFit: "cover",
                        borderRadius: "2px",
                      }}
                    />
                    <span>{n.name}</span>
                    {isSelected && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-auto"
                        style={{ color: "#6366f1", flexShrink: 0 }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Date Picker ──────────────────────────────────────────────────────────────
function DatePicker({
  value,
  onChange,
  inputBg,
  border,
  textPrimary,
  textMuted,
  dark,
}: {
  value: string;
  onChange: (v: string) => void;
  inputBg: string;
  border: string;
  textPrimary: string;
  textMuted: string;
  dark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [viewMonth, setViewMonth] = useState(() =>
    value ? new Date(value).getMonth() : new Date().getMonth(),
  );
  const [viewYear, setViewYear] = useState(() =>
    value ? new Date(value).getFullYear() : 2000,
  );
  const ref = useRef<HTMLDivElement>(null);

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
  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const YEARS = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i,
  );

  const selectedDate = value ? new Date(value) : null;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const displayValue = value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

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

  const selectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setShowYearDropdown(false);
        }}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={{
          background: inputBg,
          border: `1px solid ${open ? "#6366f1" : border}`,
          color: displayValue ? textPrimary : textMuted,
          cursor: "pointer",
          boxShadow: open ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
        }}
      >
        <span>{displayValue || "Select date of birth"}</span>
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

      {open && (
        <div
          className="absolute z-50 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            top: "calc(100% + 8px)",
            left: 0,
            width: "280px",
            background: dark ? "#0e0e1a" : "#ffffff",
            border: "1px solid rgba(99,102,241,0.25)",
            boxShadow: dark
              ? "0 8px 40px rgba(0,0,0,0.5)"
              : "0 8px 40px rgba(0,0,0,0.12)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{
              borderBottom: `1px solid ${dark ? "#1e1e32" : "#e2e4f0"}`,
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 0) {
                  setViewMonth(11);
                  setViewYear((y) => y - 1);
                } else setViewMonth((m) => m - 1);
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{
                color: textMuted,
                background: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = dark
                  ? "rgba(255,255,255,0.08)"
                  : "#f0f0ff")
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
                className="text-sm font-semibold"
                style={{ color: textPrimary }}
              >
                {MONTHS[viewMonth]}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowYearDropdown((o) => !o);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold transition-all"
                style={{
                  color: textPrimary,
                  background: showYearDropdown
                    ? "rgba(99,102,241,0.15)"
                    : "transparent",
                  border: showYearDropdown
                    ? "1px solid rgba(99,102,241,0.3)"
                    : "1px solid transparent",
                  cursor: "pointer",
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
              onClick={() => {
                if (viewMonth === 11) {
                  setViewMonth(0);
                  setViewYear((y) => y + 1);
                } else setViewMonth((m) => m + 1);
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{
                color: textMuted,
                background: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = dark
                  ? "rgba(255,255,255,0.08)"
                  : "#f0f0ff")
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
          {showYearDropdown && (
            <div
              className="overflow-y-auto"
              style={{
                maxHeight: "180px",
                background: dark ? "#0e0e1a" : "#ffffff",
                borderBottom: `1px solid ${dark ? "#1e1e32" : "#e2e4f0"}`,
              }}
            >
              {YEARS.map((year) => {
                const isActive = year === viewYear;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setViewYear(year);
                      setShowYearDropdown(false);
                    }}
                    className="w-full px-5 py-2 text-sm text-left transition-all"
                    style={{
                      background: isActive ? "#6366f1" : "transparent",
                      color: isActive ? "#ffffff" : textMuted,
                      fontWeight: isActive ? 700 : 400,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.background = dark
                          ? "rgba(99,102,241,0.12)"
                          : "#f0f0ff";
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
            </div>
          )}

          {/* Day grid */}
          {!showYearDropdown && (
            <div className="p-3">
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs py-1 font-semibold"
                    style={{ color: textMuted }}
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`e-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected =
                    selectedDate &&
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === viewMonth &&
                    selectedDate.getFullYear() === viewYear;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => selectDay(day)}
                      className="w-full aspect-square flex items-center justify-center text-xs rounded-lg transition-all"
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg, #6366f1, #818cf8)"
                          : "transparent",
                        color: isSelected ? "#ffffff" : textPrimary,
                        fontWeight: isSelected ? 700 : 400,
                        cursor: "pointer",
                        boxShadow: isSelected
                          ? "0 2px 8px rgba(99,102,241,0.4)"
                          : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected)
                          e.currentTarget.style.background = dark
                            ? "rgba(99,102,241,0.15)"
                            : "#f0f0ff";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                  }}
                  className="w-full mt-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    color: textMuted,
                    background: "transparent",
                    borderTop: `1px solid ${dark ? "#1e1e32" : "#e2e4f0"}`,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f87171";
                    e.currentTarget.style.background = "rgba(248,113,113,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = textMuted;
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Clear date
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LinkRow({
  link,
  platformInfo,
  onPlatformChange,
  onUrlChange,
  onRemove,
  showRemove,
  inputBg,
  border,
  textPrimary,
  textMuted,
  dark,
}: {
  link: Link;
  platformInfo: (typeof PLATFORMS)[0];
  onPlatformChange: (id: string) => void;
  onUrlChange: (url: string) => void;
  onRemove: () => void;
  showRemove: boolean;
  inputBg: string;
  border: string;
  textPrimary: string;
  textMuted: string;
  dark: boolean;
}) {
  return (
    <div className="flex gap-2 items-center">
      {/* Platform — using CustomSelect */}
      <div style={{ width: "150px", flexShrink: 0 }}>
        <CustomSelect
          value={link.platform}
          onChange={onPlatformChange}
          options={PLATFORMS.map((p) => ({ label: p.label, value: p.id }))}
          dark={dark}
          textPrimary={textPrimary}
          textMuted={textMuted}
          border={border}
          accentColor={platformInfo.color}
        />
      </div>

      {/* URL input */}
      <input
        type="url"
        value={link.url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder={platformInfo.placeholder}
        className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
        style={{
          background: inputBg,
          border: `1px solid ${border}`,
          color: textPrimary,
        }}
      />

      {/* Remove */}
      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer flex-shrink-0 transition-all"
          style={{
            background: "rgba(248,113,113,0.1)",
            color: "#f87171",
            border: "1px solid rgba(248,113,113,0.2)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(248,113,113,0.2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(248,113,113,0.1)")
          }
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Step2Personal({
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
  const saved = data?.personal || {};

  const buildInitialLinks = (): Link[] => {
    if (saved.links && saved.links.length > 0) {
      return saved.links.map((l: any) => ({
        id: l.id || Math.random().toString(36).slice(2),
        platform: l.platform || "portfolio",
        url: l.url || "",
      }));
    }
    const links: Link[] = [];
    const ext = extracted;
    if (ext.linkedin || saved.linkedin)
      links.push({
        id: Math.random().toString(36).slice(2),
        platform: "linkedin",
        url: ext.linkedin || saved.linkedin,
      });
    if (ext.github || saved.github)
      links.push({
        id: Math.random().toString(36).slice(2),
        platform: "github",
        url: ext.github || saved.github,
      });
    if (ext.website || saved.website)
      links.push({
        id: Math.random().toString(36).slice(2),
        platform: detectPlatform(ext.website || saved.website),
        url: ext.website || saved.website,
      });
    return links.length > 0 ? links : [makeEmptyLink()];
  };

  const [form, setForm] = useState<FormData>({
    firstName: saved.firstName || extracted.firstName || "",
    lastName: saved.lastName || extracted.lastName || "",
    email: saved.email || extracted.email || "",
    phone: saved.phone || extracted.phone || "",
    dateOfBirth: saved.dateOfBirth || extracted.dateOfBirth || "",
    nationality: saved.nationality || extracted.nationality || "",
    address: saved.address || extracted.address || "",
    city: saved.city || extracted.city || "",
    country: saved.country || extracted.country || "",
    links: buildInitialLinks(),
    photoUrl: saved.photoUrl || "",
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const valid = !!(form.firstName && form.lastName && form.email);
  const inputBg = dark ? "rgba(255,255,255,0.05)" : "#ffffff";

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm((f) => ({ ...f, photoUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const updateLink = (id: string, key: keyof Link, value: string) =>
    setForm((f) => ({
      ...f,
      links: f.links.map((l) => (l.id === id ? { ...l, [key]: value } : l)),
    }));

  const addLink = () =>
    setForm((f) => ({ ...f, links: [...f.links, makeEmptyLink()] }));
  const removeLink = (id: string) =>
    setForm((f) => ({ ...f, links: f.links.filter((l) => l.id !== id) }));

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
          Step 2 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>
          Personal details
        </h1>
        <p className="text-base" style={{ color: textMuted }}>
          Basic information used to fill application forms.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Profile Photo */}
        <div
          className="flex items-center gap-5 mb-8 p-4 rounded-2xl"
          style={{
            background: dark ? "#0e0e1a" : "#f5f5ff",
            border: `1px solid ${border}`,
          }}
        >
          <div className="relative flex-shrink-0">
            {form.photoUrl ? (
              <img
                src={form.photoUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
                style={{ border: "3px solid #6366f1" }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "2px dashed rgba(99,102,241,0.4)",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
            {form.photoUrl && (
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, photoUrl: "" }))}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs cursor-pointer"
                style={{ background: "#f87171", color: "#ffffff" }}
              >
                ×
              </button>
            )}
          </div>
          <div>
            <div
              className="text-sm font-semibold mb-1"
              style={{ color: textPrimary }}
            >
              Profile Photo{" "}
              <span
                className="font-normal text-xs"
                style={{ color: textMuted }}
              >
                (optional)
              </span>
            </div>
            <div className="text-xs mb-3" style={{ color: textMuted }}>
              JPG, PNG or WEBP. Used in your profile and applications.
            </div>
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "#6366f1",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(99,102,241,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(99,102,241,0.1)")
              }
            >
              {form.photoUrl ? "Change photo" : "Upload photo"}
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhoto}
              className="hidden"
            />
          </div>
        </div>

        {/* Form grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* First Name */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: textMuted }}
            >
              First Name *
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
              placeholder="John"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: inputBg,
                border: `1px solid ${border}`,
                color: textPrimary,
              }}
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: textMuted }}
            >
              Last Name *
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
              placeholder="Doe"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: inputBg,
                border: `1px solid ${border}`,
                color: textPrimary,
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: textMuted }}
            >
              Email *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="you@email.com"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: inputBg,
                border: `1px solid ${border}`,
                color: textPrimary,
              }}
            />
          </div>

          {/* Phone */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: textMuted }}
            >
              Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="+358 123456789"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: inputBg,
                border: `1px solid ${border}`,
                color: textPrimary,
              }}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: textMuted }}
            >
              Date of Birth
            </label>
            <DatePicker
              value={form.dateOfBirth}
              onChange={(v) => setForm((f) => ({ ...f, dateOfBirth: v }))}
              inputBg={inputBg}
              border={border}
              textPrimary={textPrimary}
              textMuted={textMuted}
              dark={dark}
            />
          </div>

          {/* Nationality */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: textMuted }}
            >
              Nationality
            </label>
            <NationalitySelect
              value={form.nationality}
              onChange={(v) => setForm((f) => ({ ...f, nationality: v }))}
              inputBg={inputBg}
              border={border}
              textPrimary={textPrimary}
              textMuted={textMuted}
              dark={dark}
            />
          </div>

          {/* Address */}
          <div className="col-span-2">
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: textMuted }}
            >
              Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              placeholder="Street 123"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: inputBg,
                border: `1px solid ${border}`,
                color: textPrimary,
              }}
            />
          </div>

          {/* City */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: textMuted }}
            >
              City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="Helsinki"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: inputBg,
                border: `1px solid ${border}`,
                color: textPrimary,
              }}
            />
          </div>

          {/* Country */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: textMuted }}
            >
              Country
            </label>
            <input
              type="text"
              value={form.country}
              onChange={(e) =>
                setForm((f) => ({ ...f, country: e.target.value }))
              }
              placeholder="Finland"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: inputBg,
                border: `1px solid ${border}`,
                color: textPrimary,
              }}
            />
          </div>

          {/* Links */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-3">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: textMuted }}
              >
                Links & Profiles
              </label>
              <button
                type="button"
                onClick={addLink}
                className="flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all px-3 py-1.5 rounded-lg"
                style={{
                  color: "#6366f1",
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(99,102,241,0.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(99,102,241,0.1)")
                }
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add link
              </button>
            </div>

            <div className="space-y-2">
              {form.links.map((link) => {
                const platformInfo =
                  PLATFORMS.find((p) => p.id === link.platform) ||
                  PLATFORMS[PLATFORMS.length - 1];
                return (
                  <LinkRow
                    key={link.id}
                    link={link}
                    platformInfo={platformInfo}
                    onPlatformChange={(pid) =>
                      updateLink(link.id, "platform", pid)
                    }
                    onUrlChange={(url) => {
                      const detected = detectPlatform(url);
                      const knownPlatforms = [
                        "linkedin",
                        "github",
                        "twitter",
                        "behance",
                        "dribbble",
                      ];
                      setForm((f) => ({
                        ...f,
                        links: f.links.map((l) =>
                          l.id === link.id
                            ? {
                                ...l,
                                url,
                                // Only auto-switch if it's a definitively known platform
                                platform: knownPlatforms.includes(detected)
                                  ? detected
                                  : l.platform,
                              }
                            : l,
                        ),
                      }));
                    }}
                    onRemove={() => removeLink(link.id)}
                    showRemove={form.links.length > 1}
                    inputBg={inputBg}
                    border={border}
                    textPrimary={textPrimary}
                    textMuted={textMuted}
                    dark={dark}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
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
          onClick={() => onNext({ personal: form })}
          disabled={!isRevisit && !valid}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{
            background: isRevisit || valid ? "#6366f1" : border,
            color: isRevisit || valid ? "#ffffff" : textMuted,
          }}
        >
          {isRevisit ? "Next →" : "Continue →"}
        </button>
      </motion.div>
    </div>
  );
}
