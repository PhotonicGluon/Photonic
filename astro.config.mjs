import { defineConfig } from "astro/config";
import glsl from "vite-plugin-glsl";

import photonicTweakpane from "./lib/tweakpane/dev-tools/integration";

import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    integrations: [photonicTweakpane, preact(), tailwind()],
    vite: {
        plugins: [glsl()],
    },
});
