import { defineConfig } from "astro/config";

import photonicTweakpane from "./lib/tweakpane/dev-tools/integration";
import preact from "@astrojs/preact";

import glsl from "vite-plugin-glsl";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    integrations: [photonicTweakpane, preact()],
    vite: {
        plugins: [glsl(), tailwindcss()],
    },
});
