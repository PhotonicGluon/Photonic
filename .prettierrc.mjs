/** @type {import("prettier").Config} */
export default {
    plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-astro", "prettier-plugin-tailwindcss"],
    tabWidth: 4,
    printWidth: 115,
    overrides: [
        {
            files: "*.astro",
            options: {
                parser: "astro",
            },
        },
        {
            files: "*.yml",
            options: {
                tabWidth: 2,
            },
        },
    ],
    tailwindStylesheet: "./src/styles/global.css",
    // Import ordering
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
};
