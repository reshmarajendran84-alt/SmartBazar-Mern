/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      // ── Colors ─────────────────────────────
      colors: {
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        accent: {
          100: "#ede9fe",
          300: "#c4b5fd",
          500: "#8b5cf6",
          700: "#6d28d9",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
        },
        neutral: {
          50:  "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          700: "#374151",
          900: "#111827",
        },
        surface: {
          page: "#f8fafc",
          card: "#ffffff",
          sidebar: "#ffffff",
        },
      },

      // ── Typography ─────────────────────────
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        display: ["'Syne'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },

      // ── Shadows ────────────────────────────
      boxShadow: {
        card: "0 2px 10px rgba(0,0,0,0.05)",
        hover: "0 8px 25px rgba(0,0,0,0.08)",
        brand: "0 4px 20px rgba(79,70,229,0.35)",
      },

      // ── Border Radius ──────────────────────
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      // ── Animations ─────────────────────────
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: 0, transform: "translateX(-16px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },

      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        "slide-in-left": "slideInLeft 0.3s ease",
      },
    },
  },

  plugins: [],
};