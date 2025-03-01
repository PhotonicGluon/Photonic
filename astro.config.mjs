import { defineConfig } from "astro/config";

import photonicTweakpane from "./lib/tweakpane/dev-tools/integration";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

import glsl from "vite-plugin-glsl";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    site: "https://photonic.dev",
    integrations: [photonicTweakpane, preact(), sitemap(), robotsTxt()],
    vite: {
        plugins: [glsl(), tailwindcss()],
    },
});
