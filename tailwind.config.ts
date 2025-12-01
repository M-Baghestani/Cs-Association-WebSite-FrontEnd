import type { Config } from "tailwindcss";

const config: Config = {
  // ...
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-vazir)", "sans-serif"], 
      },
      // ...
    },
  },
  // ...
};
export default config;