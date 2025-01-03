import { defineConfig } from "astro/config";
import glsl from "vite-plugin-glsl";

import photonicTweakpane from "./lib/tweakpane/dev-tools/integration";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    integrations: [photonicTweakpane, tailwind()],
    vite: {
        plugins: [glsl()],
    },
});
