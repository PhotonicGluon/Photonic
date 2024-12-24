import { defineConfig } from "astro/config";
import glsl from "vite-plugin-glsl";

import photonicTweakpane from "./tweakpane-integration/tweakpane-integration";

// https://astro.build/config
export default defineConfig({
    integrations: [photonicTweakpane],
    vite: {
        plugins: [glsl()],
    },
});
