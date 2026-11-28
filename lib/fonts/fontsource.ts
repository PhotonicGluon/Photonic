import { readFileSync } from "fs";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);

type Variant = {
    weight: string;
    style: "normal" | "italic";
    src: [{ url: string; tech?: string }];
    unicodeRange?: [string, ...string[]];
};

/**
 * Builds Astro local-font variants from the `@font-face` rules in specific CSS files of a Fontsource
 * variable package, so that several files (e.g. `wght.css` and `wght-italic.css`) can be merged
 * into a single font family.
 *
 * @param pkg the package name, e.g. `@fontsource-variable/dm-sans`.
 * @param cssFiles CSS files to read from the package root, e.g. `["wght.css", "wght-italic.css"]`.
 */
export default function fontsourceVariants(pkg: string, cssFiles: string[]): Variant[] {
    const pkgDir = path.dirname(require.resolve(`${pkg}/package.json`));
    const variants: Variant[] = [];

    for (const cssFile of cssFiles) {
        const css = readFileSync(path.join(pkgDir, cssFile), "utf-8");
        for (const [, body] of css.matchAll(/@font-face\s*{([^}]*)}/g)) {
            const get = (prop: string) => body.match(new RegExp(`${prop}\\s*:\\s*([^;]+);`))?.[1].trim();

            const url = get("src")?.match(/url\(([^)]+)\)/)?.[1];
            const style = get("font-style");
            const weight = get("font-weight");
            if (!url || !weight || (style !== "normal" && style !== "italic")) {
                throw new Error(`Unexpected @font-face rule in ${pkg}/${cssFile}`);
            }

            const unicodeRange = get("unicode-range");
            variants.push({
                weight,
                style,
                src: [{ url: path.join(pkgDir, url.replace(/^['"]|['"]$/g, "")) }],
                unicodeRange: unicodeRange ? [unicodeRange] : undefined,
            });
        }
    }
    return variants;
}
