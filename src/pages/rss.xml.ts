import rss, { pagesGlobToRssItems } from "@astrojs/rss";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
    return rss({
        title: "Photonic | Blog",
        description: "Photonic Blog",
        site: context.site!,
        items: await pagesGlobToRssItems(import.meta.glob("@blog/*.md")),
        customData: `<language>en-uk</language>`,
    });
}
