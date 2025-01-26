/** @type {import("tailwindcss").Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        screens: {
            sm: "480px",
            md: "768px",
            lg: "976px",
            xl: "1440px",
        },
        fontFamily: {
            sans: ["DM Sans", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
            mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Courier New", "monospace"],
        },
        extend: {
            transitionDelay: {
                400: "400ms",
                600: "600ms",
                700: "700ms",
                800: "800ms",
                900: "900ms",
            },
        },
    },
    plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate"), require("tailwindcss-intersect")],
};
