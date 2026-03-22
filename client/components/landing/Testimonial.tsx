"use client";

import { motion } from "framer-motion";
import { useThemeStore } from "@/lib/store";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Hired at Spotify",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    color: "#6366f1",
    text: "I applied to 200+ jobs in 2 weeks without lifting a finger. JobPilot filled every form perfectly and even customized cover letters for each company. Got 3 interviews in the first week.",
  },
  {
    name: "Marcus Johnson",
    role: "Product Designer",
    company: "Hired at Figma",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    color: "#a78bfa",
    text: "As a designer I was spending hours on applications. JobPilot automated everything. The AI-generated cover letters were actually better than what I was writing manually.",
  },
  {
    name: "Priya Patel",
    role: "Data Scientist",
    company: "Hired at Airbnb",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    color: "#38bdf8",
    text: "The ATS optimization feature is incredible. My application pass rate went from 20% to over 90%. JobPilot knows exactly what keywords each job needs.",
  },
  {
    name: "Tom Weber",
    role: "DevOps Engineer",
    company: "Hired at AWS",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    color: "#34d399",
    text: "I was skeptical at first but after seeing it fill out a 20-field application form in seconds, I was sold. Saved me at least 3 hours every single day.",
  },
  {
    name: "Aisha Rahman",
    role: "Marketing Manager",
    company: "Hired at HubSpot",
    avatar: "https://randomuser.me/api/portraits/women/90.jpg",
    color: "#f59e0b",
    text: "The split-screen view where you watch the AI fill the form in real time is genuinely impressive. It feels like having a personal assistant dedicated to your job search.",
  },
  {
    name: "James Liu",
    role: "Backend Engineer",
    company: "Hired at Stripe",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    color: "#ec4899",
    text: "Relocated from China to Finland. JobPilot handled applications across 5 countries simultaneously. The multilingual cover letters were spot on. Landed my dream job in 3 weeks.",
  },
];

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function Testimonials() {
  const { dark } = useThemeStore();

  const textPrimary = dark ? "#ffffff" : "#0a0a14";
  const textMuted = dark ? "#9090b0" : "#4a4a6a";
  const border = dark ? "#1e1e32" : "#e2e4f0";

  return (
    <section
      id="testimonials"
      className="py-24 px-6"
      style={{ background: dark ? "#0e0e1a" : "#f5f5ff" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-4"
            style={{
              background: dark
                ? "rgba(99,102,241,0.1)"
                : "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#6366f1",
            }}
          >
            Testimonials
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: textPrimary }}
          >
            10,000+ people got hired faster
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: textMuted }}>
            Here's what job seekers say about using JobPilot.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl p-6 flex flex-col gap-4 cursor-default"
              style={{
                background: dark ? "#111120" : "#ffffff",
                border: `1px solid ${border}`,
              }}
            >
              {/* Stars */}
              <div className="flex gap-1" style={{ color: "#f59e0b" }}>
                {[...Array(5)].map((_, j) => (
                  <StarIcon key={j} />
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: textMuted }}
              >
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: textPrimary }}
                  >
                    {t.name}
                  </div>
                  <div className="text-xs" style={{ color: t.color }}>
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
