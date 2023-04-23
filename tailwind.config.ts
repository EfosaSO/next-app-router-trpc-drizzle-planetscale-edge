import { type Config } from "tailwindcss";
import allColors from "tailwindcss/colors";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const customEase = {
  transitionProperty:
    "color, text-decoration-color, text-decoration, text-underline-offset, opacity, background-color, border-color, border, box-shadow, transform, visibility",
  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  transitionDuration: "250ms",
};

const placeCenter = {
  placeContent: "center",
  placeItems: "center",
};

const plugins = [
  plugin(function ({ addUtilities }) {
    const newUtilities = {
      ".custom-ease": customEase,
      ".place-center": placeCenter,
    };

    addUtilities(newUtilities, ["responsive", "hover"]);
  }),
  require("tailwindcss-animate"),
];

const { lightBlue, warmGray, trueGray, coolGray, blueGray, ...colors } =
  allColors;

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      ...colors,
      current: "currentColor",
    },
    extend: {
      container: {
        center: true,
        padding: "1.5rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins,
} satisfies Config;
