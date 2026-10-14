/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // Note: this replaces Tailwind's default palette rather than extending it,
    // so only the colors listed here generate utilities.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      // Palette: Mikkeller Brand Book colors, named by appearance.
      // Use directly for one-off color needs (e.g. bg-brand-peach).
      brand: {
        "evening-blue": "rgb(var(--brand-evening-blue) / <alpha-value>)",
        "moss-green": "rgb(var(--brand-moss-green) / <alpha-value>)",
        brown: "rgb(var(--brand-brown) / <alpha-value>)",
        burgundy: "rgb(var(--brand-burgundy) / <alpha-value>)",
        paper: "rgb(var(--brand-paper) / <alpha-value>)",
        peach: "rgb(var(--brand-peach) / <alpha-value>)",
        mauve: "rgb(var(--brand-mauve) / <alpha-value>)",
        red: "rgb(var(--brand-red) / <alpha-value>)",
        yellow: "rgb(var(--brand-yellow) / <alpha-value>)",
        sky: "rgb(var(--brand-sky) / <alpha-value>)",
        purple: "rgb(var(--brand-purple) / <alpha-value>)",
      },
      // Semantic: role-based, automatically swapped per theme.
      // Prefer these over palette colors in components.
      primary: "rgb(var(--color-primary) / <alpha-value>)",
      accent: "rgb(var(--color-accent) / <alpha-value>)",
      surface: "rgb(var(--color-surface) / <alpha-value>)",
    },
    extend: {
      boxShadow: {
        // For full-width bars. A spread wider than half the blur pushes the shadow's faded
        // ends past the screen edges; shadow-lg's negative spread tapers in from both
        // sides, which left the bar's bare bottom edge showing in the corners.
        "edge-to-edge": "0 -2px 15px 12px rgb(var(--color-primary))",
      },
      fontFamily: {
        sans: ["Inter var", "sans-serif"],
        mikkelwind: ["MikkelWind", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
