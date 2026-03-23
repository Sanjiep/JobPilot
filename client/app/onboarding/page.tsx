"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useThemeStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/logo";

import Step1Resume from "@/components/onboarding/steps/Step1Resume";
import Step2Personal from "@/components/onboarding/steps/Step2Personal";
import Step3Academic from "@/components/onboarding/steps/Step3Academic";
import Step4Experience from "@/components/onboarding/steps/Step4Experience";
import Step5Skills from "@/components/onboarding/steps/Step5Skills";
import Step6CoverLetter from "@/components/onboarding/steps/Step6CoverLetter";
import Step7Situation from "@/components/onboarding/steps/Step7Situation";
import Step8WorkPrefs from "@/components/onboarding/steps/Step8WorkPrefs";
import Step9Countries from "@/components/onboarding/steps/Step9Countries";
import Step10JobPrefs from "@/components/onboarding/steps/Step10JobPrefs";
import Step11Frequency from "@/components/onboarding/steps/Step11Frequency";
import Step12Email from "@/components/onboarding/steps/Step12Email";
import Step13Automation from "@/components/onboarding/steps/Step13Automation";

const STEPS = [
  { number: 1, title: "Resume / CV" },
  { number: 2, title: "Personal Details" },
  { number: 3, title: "Education" },
  { number: 4, title: "Experience" },
  { number: 5, title: "Skills" },
  { number: 6, title: "Cover Letter" },
  { number: 7, title: "Current Situation" },
  { number: 8, title: "Work Preferences" },
  { number: 9, title: "Target Countries" },
  { number: 10, title: "Job Preferences" },
  { number: 11, title: "Apply Frequency" },
  { number: 12, title: "Connect Email" },
  { number: 13, title: "Automation" },
];

const SunIcon = () => (
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
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
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
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// Step Item
function StepItem({
  step,
  isCompleted,
  isActive,
  isClickable,
  dark,
  textPrimary,
  textMuted,
  border,
  onClick,
}: {
  step: { number: number; title: string };
  isCompleted: boolean;
  isActive: boolean;
  isClickable: boolean;
  dark: boolean;
  textPrimary: string;
  textMuted: string;
  border: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={() => {
        if (isClickable) setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isActive
          ? "rgba(99,102,241,0.1)"
          : hovered
            ? dark
              ? "rgba(255,255,255,0.05)"
              : "#f0f0ff"
            : "transparent",
        border: isActive
          ? "1px solid rgba(99,102,241,0.2)"
          : "1px solid transparent",
        cursor: isClickable ? "pointer" : "default",
        transition: "background 0.15s",
      }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
        style={{
          background: isCompleted
            ? "#6366f1"
            : isActive
              ? "rgba(99,102,241,0.2)"
              : border,
          color: isCompleted ? "#ffffff" : isActive ? "#6366f1" : textMuted,
        }}
      >
        {isCompleted ? (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          step.number
        )}
      </div>

      <span
        className="text-sm flex-1 transition-all"
        style={{
          color: isActive ? "#6366f1" : isCompleted ? textPrimary : textMuted,
          fontWeight: isActive ? 600 : 400,
        }}
      >
        {step.title}
      </span>

      {isClickable && (
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
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </div>
  );
}

// Theme Toggle
function ThemeToggle({
  dark,
  toggle,
  border,
  textMuted,
  textPrimary,
}: {
  dark: boolean;
  toggle: () => void;
  border: string;
  textMuted: string;
  textPrimary: string;
}) {
  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all cursor-pointer"
      style={{ borderColor: border, color: textMuted }}
      onMouseEnter={(e) => (e.currentTarget.style.color = textPrimary)}
      onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

// User Menu
function UserMenu({
  dark,
  textPrimary,
  textMuted,
  border,
}: {
  dark: boolean;
  textPrimary: string;
  textMuted: string;
  border: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ""}`.trim()
    : (user?.email ?? "—");

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "?");

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.push("/");
  };

  const menuItems = [
    {
      label: "Language",
      icon: (
        <svg
          width="15"
          height="15"
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
      onClick: () => {},
    },
    {
      label: "Help & Support",
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      onClick: () => {},
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all"
        style={{
          background: "linear-gradient(135deg, #6366f1, #818cf8)",
          color: "#ffffff",
          boxShadow: open ? "0 0 0 3px rgba(99,102,241,0.3)" : "none",
          transition: "box-shadow 0.2s",
        }}
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden z-50"
            style={{
              background: dark ? "#0e0e1a" : "#ffffff",
              border: `1px solid ${border}`,
              boxShadow: dark
                ? "0 8px 40px rgba(0,0,0,0.5)"
                : "0 8px 40px rgba(0,0,0,0.12)",
            }}
          >
            <div
              className="px-4 py-3"
              style={{ borderBottom: `1px solid ${border}` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #818cf8)",
                    color: "#ffffff",
                  }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <div
                    className="text-sm font-semibold truncate"
                    style={{ color: textPrimary }}
                  >
                    {displayName}
                  </div>
                  <div
                    className="text-xs truncate mt-0.5"
                    style={{ color: textMuted }}
                  >
                    {user?.email ?? "—"}
                  </div>
                </div>
              </div>
            </div>

            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                style={{
                  background: "transparent",
                  color: textPrimary,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = dark
                    ? "rgba(255,255,255,0.05)"
                    : "#f5f5ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span style={{ color: textMuted }}>{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div style={{ borderTop: `1px solid ${border}` }}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                style={{
                  background: "transparent",
                  color: "#f87171",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(248,113,113,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main Page
export default function OnboardingPage() {
  const router = useRouter();
  const { dark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [highestStep, setHighestStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<Record<string, any>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (user === null) return;

    try {
      const savedStep = parseInt(
        localStorage.getItem("onboarding_step") || "1",
      );
      const savedHighest = parseInt(
        localStorage.getItem("onboarding_highest") || "1",
      );
      const savedData = JSON.parse(
        localStorage.getItem("onboarding_data") || "{}",
      );

      // Clear if no userId stamp OR if userId doesn't match current user
      if (!savedData._userId || savedData._userId !== user.id) {
        localStorage.removeItem("onboarding_step");
        localStorage.removeItem("onboarding_highest");
        localStorage.removeItem("onboarding_data");
        setCurrentStep(1);
        setHighestStep(1);
        setData({});
      } else {
        setCurrentStep(savedStep);
        setHighestStep(savedHighest);
        setData(savedData);
      }
    } catch {
      setCurrentStep(1);
      setHighestStep(1);
      setData({});
    }
  }, [mounted, user?.id]);

  const goNext = (stepData?: Record<string, any>) => {
    const newData = stepData ? { ...data, ...stepData } : data;
    if (stepData) setData(newData);

    const dataWithUser = { ...newData, _userId: user?.id };
    localStorage.setItem("onboarding_data", JSON.stringify(dataWithUser));

    if (currentStep < 13) {
      const nextStep = currentStep + 1;
      const newHighest = Math.max(highestStep, nextStep);
      setDirection(1);
      setCurrentStep(nextStep);
      setHighestStep(newHighest);
      localStorage.setItem("onboarding_step", String(nextStep));
      localStorage.setItem("onboarding_highest", String(newHighest));
    } else {
      localStorage.removeItem("onboarding_step");
      localStorage.removeItem("onboarding_highest");
      localStorage.removeItem("onboarding_data");
      router.push("/dashboard");
    }
  };

  const goPrev = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setDirection(-1);
      setCurrentStep(prevStep);
      localStorage.setItem("onboarding_step", String(prevStep));
    }
  };

  const goToStep = (stepNumber: number) => {
    if (stepNumber > highestStep) return;
    setDirection(stepNumber > currentStep ? 1 : -1);
    setCurrentStep(stepNumber);
    localStorage.setItem("onboarding_step", String(stepNumber));
  };

  const progress = ((highestStep - 1) / 12) * 100;
  const border = dark ? "#1e1e32" : "#e2e4f0";
  const textPrimary = dark ? "#ffffff" : "#0a0a14";
  const textMuted = dark ? "#9090b0" : "#4a4a6a";
  const bg = dark ? "#070711" : "#ffffff";
  const sidebarBg = dark ? "#0e0e1a" : "#f5f5ff";
  const isRevisit = currentStep <= highestStep && currentStep < highestStep;

  const stepProps = {
    onNext: goNext,
    onBack: goPrev,
    data,
    dark,
    textPrimary,
    textMuted,
    border,
    isRevisit,
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Resume {...stepProps} />;
      case 2:
        return <Step2Personal {...stepProps} />;
      case 3:
        return <Step3Academic {...stepProps} />;
      case 4:
        return <Step4Experience {...stepProps} />;
      case 5:
        return <Step5Skills {...stepProps} />;
      case 6:
        return <Step6CoverLetter {...stepProps} />;
      case 7:
        return <Step7Situation {...stepProps} />;
      case 8:
        return <Step8WorkPrefs {...stepProps} />;
      case 9:
        return <Step9Countries {...stepProps} />;
      case 10:
        return <Step10JobPrefs {...stepProps} />;
      case 11:
        return <Step11Frequency {...stepProps} />;
      case 12:
        return <Step12Email {...stepProps} />;
      case 13:
        return <Step13Automation {...stepProps} />;
      default:
        return null;
    }
  };

  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: dark ? "#070711" : "#ffffff" }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: "#6366f1", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (mounted && user === null) {
    router.push("/login");
    return null;
  }

  if (mounted && user?.onboardingCompleted) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex" style={{ background: bg }}>
      {/* Sidebar */}
      <div
        className="hidden lg:flex w-72 flex-col py-8 px-6 border-r flex-shrink-0"
        style={{ background: sidebarBg, borderColor: border }}
      >
        <div className="flex items-center gap-2 mb-8">
          <Logo height={24} dark={dark} />
        </div>

        <div className="mb-6">
          <div
            className="flex justify-between text-xs mb-2"
            style={{ color: textMuted }}
          >
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: border }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#6366f1" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="space-y-1 flex-1 overflow-y-auto">
          {STEPS.map((step) => (
            <StepItem
              key={step.number}
              step={step}
              isCompleted={step.number < highestStep}
              isActive={step.number === currentStep}
              isClickable={
                step.number <= highestStep && step.number !== currentStep
              }
              dark={dark}
              textPrimary={textPrimary}
              textMuted={textMuted}
              border={border}
              onClick={() => goToStep(step.number)}
            />
          ))}
        </div>

        <div className="mt-6 text-xs" style={{ color: textMuted }}>
          Step {currentStep} of {STEPS.length}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
          style={{ borderColor: border, background: bg }}
        >
          <div className="lg:hidden flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: textMuted }}>
              Step {currentStep} of {STEPS.length}
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: textPrimary }}
            >
              — {STEPS[currentStep - 1]?.title}
            </span>
          </div>

          <div className="hidden lg:block">
            <span
              className="text-sm font-semibold"
              style={{ color: textPrimary }}
            >
              {STEPS[currentStep - 1]?.title}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle
              dark={dark}
              toggle={toggleTheme}
              border={border}
              textMuted={textMuted}
              textPrimary={textPrimary}
            />
            <UserMenu
              dark={dark}
              textPrimary={textPrimary}
              textMuted={textMuted}
              border={border}
            />
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className="lg:hidden h-1 w-full" style={{ background: border }}>
          <motion.div
            className="h-full"
            style={{ background: "#6366f1" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
