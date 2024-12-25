import type { AstroIntegration } from "astro";

export default {
    name: "photonic-tweakpane",
    hooks: {
        "astro:config:setup": ({ addDevToolbarApp }) => {
            addDevToolbarApp({
                id: "photonic-tweakpane-dev-tools",
                name: "Tweakpane App",
                icon: "🎛️",
                entrypoint: new URL("./app.ts", import.meta.url),
            });
        },
    },
} satisfies AstroIntegration;
