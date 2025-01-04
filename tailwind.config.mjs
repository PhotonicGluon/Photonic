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
    },
    plugins: [],
    // TODO: Enable this while updating our own styles
    corePlugins: {
        preflight: false,
    },
};
