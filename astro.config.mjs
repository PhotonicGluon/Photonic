import { defineConfig } from "astro/config";

import { remarkAlert } from "remark-github-blockquote-alert";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePresetMinify from "rehype-preset-minify";

import photonicTweakpane from "./lib/tweakpane/dev-tools/integration";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import mdx from "@astrojs/mdx";
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
    integrations: [
        photonicTweakpane,
        preact(),
        sitemap(),
        robotsTxt(),
        mdx({
            remarkPlugins: [remarkAlert, remarkMath],
            rehypePlugins: [rehypeKatex, rehypePresetMinify],
            remarkRehype: {
                footnoteLabelTagName: "h1",
                footnoteLabel: "Footnotes",
                footnoteLabelProperties: { className: [] },
            },
        }),
        partytown(),
    ],
    vite: {
        plugins: [glsl(), tailwindcss()],
    },
});
