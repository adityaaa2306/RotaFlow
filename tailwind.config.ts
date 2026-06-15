import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ['"Instrument Serif"', "serif"],
      },
      colors: {
        rota: {
          blue: "#2A85FF",
          "blue-dark": "#2270E0",
        },
        flow: {
          navy: "#334155",
        },
        ink: "#1A1A1A",
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        pill: "9999px",
        lux: "1.75rem",
      },
      boxShadow: {
        lux: "0 8px 30px rgb(0 0 0 / 0.04)",
        "lux-lg": "0 12px 40px rgb(0 0 0 / 0.06)",
        "lux-btn": "0 4px 14px rgb(0 0 0 / 0.15)",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
