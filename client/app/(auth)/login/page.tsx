"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore, useThemeStore } from "@/lib/store";
import Logo from "@/components/ui/logo";
import { motion } from "framer-motion";

const cyclingWords = [
  { text: "10x more", color: "#6366f1" },
  { text: "faster", color: "#a78bfa" },
  { text: "smarter", color: "#38bdf8" },
  { text: "automated", color: "#34d399" },
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

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { dark, toggleTheme } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % cyclingWords.length);
        setVisible(true);
      }, 400);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err === "google_failed") {
      setError("Google sign in failed. Please try again.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/auth/login", form);
      const { user, token } = res.data.data;
      setAuth(user, token);
      if (!user.onboardingCompleted) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
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
        <motion.div
          className="relative z-10 flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Logo height={28} dark={dark} />
        </motion.div>

        {/* Animated text */}
        <motion.div
          className="relative z-10 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="relative z-10 space-y-6">
            <p className="text-lg font-medium" style={{ color: textMuted }}>
              JobPilot helps you get
            </p>

            <div className="space-y-2">
              <div
                className="text-7xl font-bold leading-none"
                style={{
                  color: cyclingWords[wordIndex].color,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(-16px)",
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                }}
              >
                {cyclingWords[wordIndex].text}
              </div>
              <div
                className="text-7xl font-bold leading-none"
                style={{ color: textPrimary }}
              >
                job interviews
              </div>
            </div>

            <p
              className="text-base max-w-sm leading-relaxed"
              style={{ color: textMuted }}
            >
              Upload your CV, set your preferences and JobPilot will
              automatically apply to jobs on your behalf every single day.
            </p>

            {/* Social proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {[
                  "https://randomuser.me/api/portraits/women/44.jpg",
                  "https://randomuser.me/api/portraits/men/32.jpg",
                  "https://randomuser.me/api/portraits/women/68.jpg",
                  "https://randomuser.me/api/portraits/men/75.jpg",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="User"
                    className="w-9 h-9 rounded-full border-2 object-cover"
                    style={{ borderColor: bgLeft }}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold" style={{ color: "#6366f1" }}>
                Trusted by 10,000+ job seekers worldwide
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative z-10">
            <p
              className="text-xs"
              style={{ color: dark ? "#505070" : "#8888aa" }}
            >
              © 2026 JobPilot. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Right Side ── */}
      <div
        className="w-full lg:w-1/2 flex flex-col"
        style={{ background: bgRight }}
      >
        {/* Top bar — theme + home only */}
        <div className="flex items-center justify-end gap-2 px-8 py-6">
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

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-8">
          <div className="w-full max-w-sm">
            {/* Logo above form */}
            <div className="flex items-center gap-2 mb-6">
              <Logo height={24} dark={dark} />
            </div>

            <h2
              className="text-3xl font-bold mb-1"
              style={{ color: textPrimary }}
            >
              Sign in
            </h2>
            <p className="text-sm mb-8" style={{ color: textMuted }}>
              Welcome back! Please enter your details.
            </p>

            {error && (
              <div
                className="rounded-xl px-4 py-3 mb-6 text-sm"
                style={{
                  background: "rgba(248,113,113,0.1)",
                  border: "1px solid rgba(248,113,113,0.3)",
                  color: "#f87171",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
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
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    className="text-sm font-medium"
                    style={{ color: textMuted }}
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm cursor-pointer"
                    style={{ color: "#6366f1" }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-all"
                    style={{ color: textMuted }}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

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
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
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
              onClick={() =>
                (window.location.href = "http://localhost:8000/api/auth/google")
              }
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
              Sign in with Google
            </button>

            {/* Sign up link */}
            <p
              className="text-center text-sm mt-6"
              style={{ color: textMuted }}
            >
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold cursor-pointer"
                style={{ color: "#6366f1" }}
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
