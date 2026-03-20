"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useThemeStore } from "@/lib/store";

const EyeIcon = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
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
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

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

const HomeIcon = () => (
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
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CheckIcon = () => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { dark, toggleTheme } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordChecks = [
    { label: "At least 8 characters", valid: form.password.length >= 8 },
    { label: "Contains a number", valid: /\d/.test(form.password) },
    {
      label: "Passwords match",
      valid:
        form.password === form.confirmPassword && form.confirmPassword !== "",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      const { user, token } = res.data.data;
      setAuth(user, token);
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const border = dark ? "#1e1e32" : "#e2e4f0";
  const textPrimary = dark ? "#ffffff" : "#0a0a14";
  const textMuted = dark ? "#9090b0" : "#4a4a6a";
  const inputBg = dark ? "rgba(255,255,255,0.05)" : "#f5f5ff";
  const bgRight = dark ? "#070711" : "#ffffff";
  const bgLeft = dark ? "#0e0e1a" : "#f5f5ff";

  return (
    <div className="min-h-screen flex" style={{ background: bgRight }}>
      {/* ── Left Side ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden"
        style={{ background: bgLeft }}
      >
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: "#6366f1" }}
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full blur-3xl opacity-15"
            style={{ background: "#a78bfa" }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Logo height={28} dark={dark} />
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2
              className="text-5xl font-bold leading-tight"
              style={{ color: textPrimary }}
            >
              Start your journey to getting hired faster
            </h2>
            <p
              className="text-base mt-4 leading-relaxed max-w-sm"
              style={{ color: textMuted }}
            >
              Join thousands of job seekers who let JobPilot handle their
              applications automatically.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              "AI fills every job application for you",
              "Custom cover letter for every job",
              "Apply to 100+ jobs per day automatically",
              "Track all applications in one place",
              "Get notified when companies reply",
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#6366f1" }}
                >
                  <CheckIcon />
                </div>
                <span className="text-sm" style={{ color: textMuted }}>
                  {f}
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "10,000+", label: "Job seekers" },
              { value: "500+", label: "Job boards" },
              { value: "92%", label: "ATS pass rate" },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-xl p-4 text-center"
                style={{
                  background: dark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
                  border: `1px solid ${border}`,
                }}
              >
                <div className="text-xl font-bold" style={{ color: "#6366f1" }}>
                  {s.value}
                </div>
                <div className="text-xs mt-1" style={{ color: textMuted }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p
            className="text-xs"
            style={{ color: dark ? "#505070" : "#8888aa" }}
          >
            © 2026 JobPilot. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right Side ── */}
      <div
        className="w-full lg:w-1/2 flex flex-col"
        style={{ background: bgRight }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-6">
          {/* Back to login — left */}
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm cursor-pointer transition-all"
            style={{ color: textMuted }}
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
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to sign in
          </Link>

          {/* Right — home + theme */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all cursor-pointer"
              style={{ borderColor: border, color: textMuted }}
            >
              <HomeIcon />
            </Link>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all cursor-pointer"
              style={{ borderColor: border, color: textMuted }}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-4">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="mb-6">
              <Logo height={24} dark={dark} />
            </div>

            <h2
              className="text-3xl font-bold mb-1"
              style={{ color: textPrimary }}
            >
              Create account
            </h2>
            <p className="text-sm mb-6" style={{ color: textMuted }}>
              Start applying to jobs automatically today.
            </p>

            {error && (
              <div
                className="rounded-xl px-4 py-3 mb-4 text-sm"
                style={{
                  background: "rgba(248,113,113,0.1)",
                  border: "1px solid rgba(248,113,113,0.3)",
                  color: "#f87171",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: textMuted }}
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
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
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: textMuted }}
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
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
              </div>

              {/* Email */}
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: textMuted }}
                >
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{
                    background: inputBg,
                    border: `1px solid ${border}`,
                    color: textPrimary,
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: textMuted }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Min 8 characters"
                    className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all"
                    style={{
                      background: inputBg,
                      border: `1px solid ${border}`,
                      color: textPrimary,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ color: textMuted }}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: textMuted }}
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all"
                    style={{
                      background: inputBg,
                      border: `1px solid ${border}`,
                      color: textPrimary,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ color: textMuted }}
                  >
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Password checks */}
              {form.password && (
                <div className="flex gap-2">
                  {passwordChecks.map((check, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: check.valid ? "#34d399" : border }}
                      >
                        {check.valid && (
                          <svg
                            width="8"
                            height="8"
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
                      <span
                        className="text-xs"
                        style={{ color: check.valid ? "#34d399" : textMuted }}
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                style={{
                  background: "#6366f1",
                  color: "#ffffff",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: border }} />
              <span
                className="text-xs"
                style={{ color: dark ? "#505070" : "#8888aa" }}
              >
                OR
              </span>
              <div className="flex-1 h-px" style={{ background: border }} />
            </div>

            {/* Google */}
            <button
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={{
                background: "transparent",
                border: `1px solid ${border}`,
                color: textPrimary,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
                />
                <path
                  fill="#34A853"
                  d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"
                />
                <path
                  fill="#FBBC05"
                  d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"
                />
                <path
                  fill="#EA4335"
                  d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"
                />
              </svg>
              Sign up with Google
            </button>

            {/* Sign in link */}
            <p
              className="text-center text-sm mt-4"
              style={{ color: textMuted }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold cursor-pointer"
                style={{ color: "#6366f1" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
