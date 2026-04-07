/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        canvas: "#eaeded",
        accent: "#ff9900",
        panel: "#ffffff",
        night: "#eaeded",
        sand: "#d9efff",
        brass: "#ff9900",
        taupe: "#5f6b7a",
      },
      boxShadow: {
        soft: "0 18px 40px rgba(35, 47, 62, 0.12)",
        stage: "0 28px 70px rgba(35, 47, 62, 0.18)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 14% 18%, rgba(89, 167, 255, 0.18), transparent 26%), radial-gradient(circle at 80% 12%, rgba(255, 153, 0, 0.12), transparent 20%), radial-gradient(circle at 72% 78%, rgba(35, 47, 62, 0.09), transparent 26%)",
      },
    },
  },
  plugins: [],
};
