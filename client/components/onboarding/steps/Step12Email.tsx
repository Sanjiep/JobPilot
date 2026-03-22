"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const providers = [
  {
    id: "gmail",
    name: "Gmail",
    desc: "Connect your Google account",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="#EA4335"
          d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
        />
        <path
          fill="#34A853"
          d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
        />
        <path
          fill="#4A90E2"
          d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
        />
        <path
          fill="#FBBC05"
          d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
        />
      </svg>
    ),
  },
  {
    id: "outlook",
    name: "Outlook",
    desc: "Connect your Microsoft account",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="10" y="2" width="20" height="28" rx="2" fill="#1066B5" />
        <rect
          x="10"
          y="2"
          width="20"
          height="28"
          rx="2"
          fill="url(#paint0_linear_87_7742)"
        />
        <rect x="10" y="5" width="10" height="10" fill="#32A9E7" />
        <rect x="10" y="15" width="10" height="10" fill="#167EB4" />
        <rect x="20" y="15" width="10" height="10" fill="#32A9E7" />
        <rect x="20" y="5" width="10" height="10" fill="#58D9FD" />
        <mask
          id="mask0_87_7742"
        style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="8"
          y="14"
          width="24"
          height="16"
        >
          <path
            d="M8 14H30C31.1046 14 32 14.8954 32 16V28C32 29.1046 31.1046 30 30 30H10C8.89543 30 8 29.1046 8 28V14Z"
            fill="url(#paint1_linear_87_7742)"
          />
        </mask>
        <g mask="url(#mask0_87_7742)">
          <path d="M32 14V18H30V14H32Z" fill="#135298" />
          <path d="M32 30V16L7 30H32Z" fill="url(#paint2_linear_87_7742)" />
          <path d="M8 30V16L33 30H8Z" fill="url(#paint3_linear_87_7742)" />
        </g>
        <path
          d="M8 12C8 10.3431 9.34315 9 11 9H17C18.6569 9 20 10.3431 20 12V24C20 25.6569 18.6569 27 17 27H8V12Z"
          fill="#000000"
          fill-opacity="0.3"
        />
        <rect
          y="7"
          width="18"
          height="18"
          rx="2"
          fill="url(#paint4_linear_87_7742)"
        />
        <path
          d="M14 16.0693V15.903C14 13.0222 11.9272 11 9.01582 11C6.08861 11 4 13.036 4 15.9307V16.097C4 18.9778 6.07278 21 9 21C11.9114 21 14 18.964 14 16.0693ZM11.6424 16.097C11.6424 18.0083 10.5665 19.1579 9.01582 19.1579C7.46519 19.1579 6.37342 17.9806 6.37342 16.0693V15.903C6.37342 13.9917 7.44937 12.8421 9 12.8421C10.5348 12.8421 11.6424 14.0194 11.6424 15.9307V16.097Z"
          fill="white"
        />
        <defs>
          <linearGradient
            id="paint0_linear_87_7742"
            x1="10"
            y1="16"
            x2="30"
            y2="16"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#064484" />
            <stop offset="1" stop-color="#0F65B5" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_87_7742"
            x1="8"
            y1="26.7692"
            x2="32"
            y2="26.7692"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#1B366F" />
            <stop offset="1" stop-color="#2657B0" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_87_7742"
            x1="32"
            y1="23"
            x2="8"
            y2="23"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#44DCFD" />
            <stop offset="0.453125" stop-color="#259ED0" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_87_7742"
            x1="8"
            y1="23"
            x2="32"
            y2="23"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#259ED0" />
            <stop offset="1" stop-color="#44DCFD" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_87_7742"
            x1="0"
            y1="16"
            x2="18"
            y2="16"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#064484" />
            <stop offset="1" stop-color="#0F65B5" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
];

const benefits = [
  {
    label: "Detect interview invitations automatically",
    icon: (
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
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "Track application replies in your dashboard",
    icon: (
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
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: "Get notified when companies respond",
    icon: (
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
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    label: "Send follow-up emails on your behalf",
    icon: (
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
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
  },
];

export default function Step12Email({
  onNext,
  onBack,
  data,
  dark,
  textPrimary,
  textMuted,
  border,
  isRevisit,
}: Props) {
  const saved = data?.email || {};
  const [connected, setConnected] = useState<string | null>(
    saved.connected || null,
  );
  const [skipped, setSkipped] = useState(saved.skipped || false);

  const cardBg = dark ? "#0e0e1a" : "#f5f5ff";
  const canContinue = connected !== null || skipped;

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
          Step 12 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>
          Connect your email
        </h1>
        <p className="text-base" style={{ color: textMuted }}>
          Let JobPilot monitor replies and detect interview invitations.
        </p>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl p-5 mb-6"
        style={{ background: cardBg, border: `1px solid ${border}` }}
      >
        <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
          Why connect your email?
        </div>
        <div className="space-y-2.5">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}
              >
                {b.icon}
              </div>
              <span className="text-sm" style={{ color: textMuted }}>
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Connected state */}
      <AnimatePresence>
        {connected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl p-4 mb-6 flex items-center gap-3"
            style={{
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.3)",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(52,211,153,0.2)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="flex-1">
              <div
                className="text-sm font-semibold"
                style={{ color: "#34d399" }}
              >
                {connected === "gmail" ? "Gmail" : "Outlook"} connected!
              </div>
              <div className="text-xs mt-0.5" style={{ color: textMuted }}>
                JobPilot will monitor your inbox for replies
              </div>
            </div>
            <button
              onClick={() => setConnected(null)}
              className="text-xs cursor-pointer transition-all px-3 py-1.5 rounded-lg"
              style={{
                color: textMuted,
                background: "transparent",
                border: `1px solid ${border}`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
              onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
            >
              Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Provider buttons */}
      <AnimatePresence>
        {!connected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 mb-4"
          >
            {providers.map((p) => (
              <motion.button
                key={p.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setConnected(p.id);
                  setSkipped(false);
                }}
                className="w-full flex items-center gap-4 rounded-2xl p-4 cursor-pointer transition-all"
                style={{ background: cardBg, border: `1px solid ${border}` }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#6366f1")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = border)
                }
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: dark ? "rgba(255,255,255,0.06)" : "#ffffff",
                  }}
                >
                  {p.icon}
                </div>
                <div className="text-left flex-1">
                  <div
                    className="text-sm font-semibold"
                    style={{ color: textPrimary }}
                  >
                    Connect {p.name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: textMuted }}>
                    {p.desc}
                  </div>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: textMuted, flexShrink: 0 }}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </motion.button>
            ))}

            {/* Skip */}
            <button
              onClick={() => {
                setSkipped(true);
                setConnected(null);
              }}
              className="w-full py-3 rounded-xl text-sm font-medium cursor-pointer transition-all"
              style={{
                background: "transparent",
                border: `1px dashed ${border}`,
                color: textMuted,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = textPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
            >
              Skip for now — I'll connect later
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skipped state */}
      <AnimatePresence>
        {skipped && !connected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl p-4 mb-6 flex items-center gap-3"
            style={{
              background: dark ? "rgba(255,255,255,0.03)" : "#f5f5ff",
              border: `1px solid ${border}`,
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: dark ? "rgba(255,255,255,0.05)" : "#ebebff",
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="flex-1">
              <div
                className="text-sm font-semibold"
                style={{ color: textPrimary }}
              >
                Skipped for now
              </div>
              <div className="text-xs mt-0.5" style={{ color: textMuted }}>
                You can connect your email later from settings
              </div>
            </div>
            <button
              onClick={() => setSkipped(false)}
              className="text-xs cursor-pointer transition-all px-3 py-1.5 rounded-lg"
              style={{
                color: "#6366f1",
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              Connect now
            </button>
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
          onClick={() =>
            isRevisit ? onNext() : onNext({ email: { connected, skipped } })
          }
          disabled={!isRevisit && !canContinue}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{
            background: isRevisit || canContinue ? "#6366f1" : border,
            color: isRevisit || canContinue ? "#ffffff" : textMuted,
          }}
        >
          {isRevisit ? "Next →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
