import photonicTweakpane from "./lib/tweakpane/dev-tools/integration";
import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import rehypePresetMinify from "rehype-preset-minify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeWrapAll from "rehype-wrap-all";
import { remarkAlert } from "remark-github-blockquote-alert";
import remarkMath from "remark-math";
import glsl from "vite-plugin-glsl";

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
            syntaxHighlight: false,
            remarkPlugins: [remarkAlert, remarkMath],
            rehypePlugins: [
                rehypeKatex,
                [
                    rehypeWrapAll,
                    [
                        { selector: "table", wrapper: "div.markdown-table" }, // Wrap all tables with wrapper
                        { selector: "h1,h2,h3,h4,h5,h6", wrapper: "div.heading-wrapper" }, // Wrap all headings with wrapper
                    ],
                ],
                [rehypePrettyCode, { defaultLang: "plaintext" }],
                rehypePresetMinify,
            ],
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
