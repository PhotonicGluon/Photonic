import { defineConfig } from "astro/config";

import photonicTweakpane from "./lib/tweakpane/dev-tools/integration";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import partytown from "@astrojs/partytown";

import glsl from "vite-plugin-glsl";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    site: "https://photonic.dev",
    image: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "f4.bcbits.com",
            },
            {
                hostname: "photonic.dev",
            },
            {
                protocol: "https",
                hostname: "raw.githubusercontent.com",
            },
        ],
    },
    integrations: [photonicTweakpane, preact(), sitemap(), robotsTxt(), partytown()],
    vite: {
        plugins: [glsl(), tailwindcss()],
    },
});
