/** @type {import("prettier").Config} */
export default {
    plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
    tabWidth: 4,
    printWidth: 110,
    overrides: [
        {
            files: "*.astro",
            options: {
                parser: "astro",
            },
        },
    ],
    tailwindConfig: "./tailwind.config.mjs"
};
