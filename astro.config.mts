import { defineConfig } from "astro/config";
import glsl from "vite-plugin-glsl";

import photonicTweakpane from "./lib/tweakpane/dev-tools/integration";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
    integrations: [photonicTweakpane, preact()],
    vite: {
        plugins: [glsl()],
    },
});
