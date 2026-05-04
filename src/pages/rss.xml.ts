import rss from "@astrojs/rss";
import { posts } from "@lib/blog";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
    return rss({
        title: "Photonic | Blog",
        description: "Photonic Blog",
        site: context.site!,
        stylesheet: "/rss/pretty-feed-v3.xsl",
        items: posts.map((post) => ({
            title: post.title,
            pubDate: post.pubDate,
            description: post.summary,
            link: `/blog/${post.slug}`,
        })),
        customData: `<language>en-uk</language>`,
    });
}
