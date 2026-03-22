"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  onNext: (data?: Record<string, any>) => void;
  onBack: () => void;
  data: Record<string, any>;
  dark: boolean;
  textPrimary: string;
  textMuted: string;
  border: string;
  isRevisit?: boolean
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
  website: string;
  photoUrl: string;
}

// Nationalities data — top level
const NATIONALITIES = [
  { code: "AF", name: "Afghan", flag: "🇦🇫" },
  { code: "AL", name: "Albanian", flag: "🇦🇱" },
  { code: "DZ", name: "Algerian", flag: "🇩🇿" },
  { code: "AD", name: "Andorran", flag: "🇦🇩" },
  { code: "AO", name: "Angolan", flag: "🇦🇴" },
  { code: "AG", name: "Antiguan", flag: "🇦🇬" },
  { code: "AR", name: "Argentine", flag: "🇦🇷" },
  { code: "AM", name: "Armenian", flag: "🇦🇲" },
  { code: "AU", name: "Australian", flag: "🇦🇺" },
  { code: "AT", name: "Austrian", flag: "🇦🇹" },
  { code: "AZ", name: "Azerbaijani", flag: "🇦🇿" },
  { code: "BS", name: "Bahamian", flag: "🇧🇸" },
  { code: "BH", name: "Bahraini", flag: "🇧🇭" },
  { code: "BD", name: "Bangladeshi", flag: "🇧🇩" },
  { code: "BB", name: "Barbadian", flag: "🇧🇧" },
  { code: "BY", name: "Belarusian", flag: "🇧🇾" },
  { code: "BE", name: "Belgian", flag: "🇧🇪" },
  { code: "BZ", name: "Belizean", flag: "🇧🇿" },
  { code: "BJ", name: "Beninese", flag: "🇧🇯" },
  { code: "BT", name: "Bhutanese", flag: "🇧🇹" },
  { code: "BO", name: "Bolivian", flag: "🇧🇴" },
  { code: "BA", name: "Bosnian", flag: "🇧🇦" },
  { code: "BW", name: "Botswanan", flag: "🇧🇼" },
  { code: "BR", name: "Brazilian", flag: "🇧🇷" },
  { code: "BN", name: "Bruneian", flag: "🇧🇳" },
  { code: "BG", name: "Bulgarian", flag: "🇧🇬" },
  { code: "BF", name: "Burkinabe", flag: "🇧🇫" },
  { code: "BI", name: "Burundian", flag: "🇧🇮" },
  { code: "CV", name: "Cape Verdean", flag: "🇨🇻" },
  { code: "KH", name: "Cambodian", flag: "🇰🇭" },
  { code: "CM", name: "Cameroonian", flag: "🇨🇲" },
  { code: "CA", name: "Canadian", flag: "🇨🇦" },
  { code: "CF", name: "Central African", flag: "🇨🇫" },
  { code: "TD", name: "Chadian", flag: "🇹🇩" },
  { code: "CL", name: "Chilean", flag: "🇨🇱" },
  { code: "CN", name: "Chinese", flag: "🇨🇳" },
  { code: "CO", name: "Colombian", flag: "🇨🇴" },
  { code: "KM", name: "Comorian", flag: "🇰🇲" },
  { code: "CG", name: "Congolese", flag: "🇨🇬" },
  { code: "CR", name: "Costa Rican", flag: "🇨🇷" },
  { code: "HR", name: "Croatian", flag: "🇭🇷" },
  { code: "CU", name: "Cuban", flag: "🇨🇺" },
  { code: "CY", name: "Cypriot", flag: "🇨🇾" },
  { code: "CZ", name: "Czech", flag: "🇨🇿" },
  { code: "DK", name: "Danish", flag: "🇩🇰" },
  { code: "DJ", name: "Djiboutian", flag: "🇩🇯" },
  { code: "DM", name: "Dominican", flag: "🇩🇲" },
  { code: "DO", name: "Dominican (Rep)", flag: "🇩🇴" },
  { code: "EC", name: "Ecuadorian", flag: "🇪🇨" },
  { code: "EG", name: "Egyptian", flag: "🇪🇬" },
  { code: "SV", name: "Salvadoran", flag: "🇸🇻" },
  { code: "GQ", name: "Equatoguinean", flag: "🇬🇶" },
  { code: "ER", name: "Eritrean", flag: "🇪🇷" },
  { code: "EE", name: "Estonian", flag: "🇪🇪" },
  { code: "SZ", name: "Swazi", flag: "🇸🇿" },
  { code: "ET", name: "Ethiopian", flag: "🇪🇹" },
  { code: "FJ", name: "Fijian", flag: "🇫🇯" },
  { code: "FI", name: "Finnish", flag: "🇫🇮" },
  { code: "FR", name: "French", flag: "🇫🇷" },
  { code: "GA", name: "Gabonese", flag: "🇬🇦" },
  { code: "GM", name: "Gambian", flag: "🇬🇲" },
  { code: "GE", name: "Georgian", flag: "🇬🇪" },
  { code: "DE", name: "German", flag: "🇩🇪" },
  { code: "GH", name: "Ghanaian", flag: "🇬🇭" },
  { code: "GR", name: "Greek", flag: "🇬🇷" },
  { code: "GD", name: "Grenadian", flag: "🇬🇩" },
  { code: "GT", name: "Guatemalan", flag: "🇬🇹" },
  { code: "GN", name: "Guinean", flag: "🇬🇳" },
  { code: "GW", name: "Guinea-Bissauan", flag: "🇬🇼" },
  { code: "GY", name: "Guyanese", flag: "🇬🇾" },
  { code: "HT", name: "Haitian", flag: "🇭🇹" },
  { code: "HN", name: "Honduran", flag: "🇭🇳" },
  { code: "HU", name: "Hungarian", flag: "🇭🇺" },
  { code: "IS", name: "Icelandic", flag: "🇮🇸" },
  { code: "IN", name: "Indian", flag: "🇮🇳" },
  { code: "ID", name: "Indonesian", flag: "🇮🇩" },
  { code: "IR", name: "Iranian", flag: "🇮🇷" },
  { code: "IQ", name: "Iraqi", flag: "🇮🇶" },
  { code: "IE", name: "Irish", flag: "🇮🇪" },
  { code: "IL", name: "Israeli", flag: "🇮🇱" },
  { code: "IT", name: "Italian", flag: "🇮🇹" },
  { code: "JM", name: "Jamaican", flag: "🇯🇲" },
  { code: "JP", name: "Japanese", flag: "🇯🇵" },
  { code: "JO", name: "Jordanian", flag: "🇯🇴" },
  { code: "KZ", name: "Kazakhstani", flag: "🇰🇿" },
  { code: "KE", name: "Kenyan", flag: "🇰🇪" },
  { code: "KI", name: "I-Kiribati", flag: "🇰🇮" },
  { code: "KP", name: "North Korean", flag: "🇰🇵" },
  { code: "KR", name: "South Korean", flag: "🇰🇷" },
  { code: "KW", name: "Kuwaiti", flag: "🇰🇼" },
  { code: "KG", name: "Kyrgyz", flag: "🇰🇬" },
  { code: "LA", name: "Laotian", flag: "🇱🇦" },
  { code: "LV", name: "Latvian", flag: "🇱🇻" },
  { code: "LB", name: "Lebanese", flag: "🇱🇧" },
  { code: "LS", name: "Basotho", flag: "🇱🇸" },
  { code: "LR", name: "Liberian", flag: "🇱🇷" },
  { code: "LY", name: "Libyan", flag: "🇱🇾" },
  { code: "LI", name: "Liechtensteiner", flag: "🇱🇮" },
  { code: "LT", name: "Lithuanian", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourgish", flag: "🇱🇺" },
  { code: "MG", name: "Malagasy", flag: "🇲🇬" },
  { code: "MW", name: "Malawian", flag: "🇲🇼" },
  { code: "MY", name: "Malaysian", flag: "🇲🇾" },
  { code: "MV", name: "Maldivian", flag: "🇲🇻" },
  { code: "ML", name: "Malian", flag: "🇲🇱" },
  { code: "MT", name: "Maltese", flag: "🇲🇹" },
  { code: "MH", name: "Marshallese", flag: "🇲🇭" },
  { code: "MR", name: "Mauritanian", flag: "🇲🇷" },
  { code: "MU", name: "Mauritian", flag: "🇲🇺" },
  { code: "MX", name: "Mexican", flag: "🇲🇽" },
  { code: "FM", name: "Micronesian", flag: "🇫🇲" },
  { code: "MD", name: "Moldovan", flag: "🇲🇩" },
  { code: "MC", name: "Monegasque", flag: "🇲🇨" },
  { code: "MN", name: "Mongolian", flag: "🇲🇳" },
  { code: "ME", name: "Montenegrin", flag: "🇲🇪" },
  { code: "MA", name: "Moroccan", flag: "🇲🇦" },
  { code: "MZ", name: "Mozambican", flag: "🇲🇿" },
  { code: "MM", name: "Burmese", flag: "🇲🇲" },
  { code: "NA", name: "Namibian", flag: "🇳🇦" },
  { code: "NR", name: "Nauruan", flag: "🇳🇷" },
  { code: "NP", name: "Nepali", flag: "🇳🇵" },
  { code: "NL", name: "Dutch", flag: "🇳🇱" },
  { code: "NZ", name: "New Zealander", flag: "🇳🇿" },
  { code: "NI", name: "Nicaraguan", flag: "🇳🇮" },
  { code: "NE", name: "Nigerien", flag: "🇳🇪" },
  { code: "NG", name: "Nigerian", flag: "🇳🇬" },
  { code: "MK", name: "Macedonian", flag: "🇲🇰" },
  { code: "NO", name: "Norwegian", flag: "🇳🇴" },
  { code: "OM", name: "Omani", flag: "🇴🇲" },
  { code: "PK", name: "Pakistani", flag: "🇵🇰" },
  { code: "PW", name: "Palauan", flag: "🇵🇼" },
  { code: "PA", name: "Panamanian", flag: "🇵🇦" },
  { code: "PG", name: "Papua New Guinean", flag: "🇵🇬" },
  { code: "PY", name: "Paraguayan", flag: "🇵🇾" },
  { code: "PE", name: "Peruvian", flag: "🇵🇪" },
  { code: "PH", name: "Filipino", flag: "🇵🇭" },
  { code: "PL", name: "Polish", flag: "🇵🇱" },
  { code: "PT", name: "Portuguese", flag: "🇵🇹" },
  { code: "QA", name: "Qatari", flag: "🇶🇦" },
  { code: "RO", name: "Romanian", flag: "🇷🇴" },
  { code: "RU", name: "Russian", flag: "🇷🇺" },
  { code: "RW", name: "Rwandan", flag: "🇷🇼" },
  { code: "KN", name: "Kittitian", flag: "🇰🇳" },
  { code: "LC", name: "Saint Lucian", flag: "🇱🇨" },
  { code: "VC", name: "Vincentian", flag: "🇻🇨" },
  { code: "WS", name: "Samoan", flag: "🇼🇸" },
  { code: "SM", name: "Sammarinese", flag: "🇸🇲" },
  { code: "ST", name: "São Toméan", flag: "🇸🇹" },
  { code: "SA", name: "Saudi", flag: "🇸🇦" },
  { code: "SN", name: "Senegalese", flag: "🇸🇳" },
  { code: "RS", name: "Serbian", flag: "🇷🇸" },
  { code: "SC", name: "Seychellois", flag: "🇸🇨" },
  { code: "SL", name: "Sierra Leonean", flag: "🇸🇱" },
  { code: "SG", name: "Singaporean", flag: "🇸🇬" },
  { code: "SK", name: "Slovak", flag: "🇸🇰" },
  { code: "SI", name: "Slovenian", flag: "🇸🇮" },
  { code: "SB", name: "Solomon Islander", flag: "🇸🇧" },
  { code: "SO", name: "Somali", flag: "🇸🇴" },
  { code: "ZA", name: "South African", flag: "🇿🇦" },
  { code: "SS", name: "South Sudanese", flag: "🇸🇸" },
  { code: "ES", name: "Spanish", flag: "🇪🇸" },
  { code: "LK", name: "Sri Lankan", flag: "🇱🇰" },
  { code: "SD", name: "Sudanese", flag: "🇸🇩" },
  { code: "SR", name: "Surinamese", flag: "🇸🇷" },
  { code: "SE", name: "Swedish", flag: "🇸🇪" },
  { code: "CH", name: "Swiss", flag: "🇨🇭" },
  { code: "SY", name: "Syrian", flag: "🇸🇾" },
  { code: "TW", name: "Taiwanese", flag: "🇹🇼" },
  { code: "TJ", name: "Tajik", flag: "🇹🇯" },
  { code: "TZ", name: "Tanzanian", flag: "🇹🇿" },
  { code: "TH", name: "Thai", flag: "🇹🇭" },
  { code: "TL", name: "Timorese", flag: "🇹🇱" },
  { code: "TG", name: "Togolese", flag: "🇹🇬" },
  { code: "TO", name: "Tongan", flag: "🇹🇴" },
  { code: "TT", name: "Trinidadian", flag: "🇹🇹" },
  { code: "TN", name: "Tunisian", flag: "🇹🇳" },
  { code: "TR", name: "Turkish", flag: "🇹🇷" },
  { code: "TM", name: "Turkmen", flag: "🇹🇲" },
  { code: "TV", name: "Tuvaluan", flag: "🇹🇻" },
  { code: "UG", name: "Ugandan", flag: "🇺🇬" },
  { code: "UA", name: "Ukrainian", flag: "🇺🇦" },
  { code: "AE", name: "Emirati", flag: "🇦🇪" },
  { code: "GB", name: "British", flag: "🇬🇧" },
  { code: "US", name: "American", flag: "🇺🇸" },
  { code: "UY", name: "Uruguayan", flag: "🇺🇾" },
  { code: "UZ", name: "Uzbek", flag: "🇺🇿" },
  { code: "VU", name: "Vanuatuan", flag: "🇻🇺" },
  { code: "VE", name: "Venezuelan", flag: "🇻🇪" },
  { code: "VN", name: "Vietnamese", flag: "🇻🇳" },
  { code: "YE", name: "Yemeni", flag: "🇾🇪" },
  { code: "ZM", name: "Zambian", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwean", flag: "🇿🇼" },
];

// Nationality Select — top level component
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
          transition: "border-color 0.2s, box-shadow 0.2s",
          textAlign: "left",
        }}
      >
        <span className="flex items-center gap-2">
          {selected ? (
            <>
              <img
                src={`https://flagcdn.com/24x18/${selected.code.toLowerCase()}.png`}
                alt={selected.name}
                className="rounded-sm flex-shrink-0"
                style={{ width: "20px", height: "15px", objectFit: "cover" }}
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
          {/* Search */}
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

          {/* List */}
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
                      className="rounded-sm flex-shrink-0"
                      style={{ width: "20px", height: "15px", objectFit: "cover" }}
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

// Date Picker — top level component
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
          transition: "border-color 0.2s, box-shadow 0.2s",
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
                onMouseEnter={(e) => {
                  if (!showYearDropdown)
                    e.currentTarget.style.background = dark
                      ? "rgba(255,255,255,0.08)"
                      : "#f0f0ff";
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

// Main Component
export default function Step2Personal({
  onNext,
  onBack,
  data,
  dark,
  textPrimary,
  textMuted,
  border,
  isRevisit
}: Props) {
  const extracted = data?.extractedData || {};
  const saved = data?.personal || {};
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
    website: saved.website || extracted.website || "",
    photoUrl: saved.photoUrl || "",
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const valid = form.firstName && form.lastName && form.email;
  const inputBg = dark ? "rgba(255,255,255,0.05)" : "#ffffff";

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm((f) => ({ ...f, photoUrl: reader.result as string }));
    reader.readAsDataURL(file);
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

          <div className="col-span-2">
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: textMuted }}
            >
              Portfolio / Website
            </label>
            <input
              type="url"
              value={form.website}
              onChange={(e) =>
                setForm((f) => ({ ...f, website: e.target.value }))
              }
              placeholder="https://yoursite.com"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: inputBg,
                border: `1px solid ${border}`,
                color: textPrimary,
              }}
            />
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
          disabled={!valid}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{
            background: valid ? "#6366f1" : border,
            color: valid ? "#ffffff" : textMuted,
          }}
        >
          {isRevisit ? 'Next →' : 'Continue →'}
        </button>
      </motion.div>
    </div>
  );
}
