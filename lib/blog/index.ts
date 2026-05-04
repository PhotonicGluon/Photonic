import { toPost } from "./post";
import { getCollection } from "astro:content";

// Load all blog posts, sorting them by date
const rawUnsortedPosts = await getCollection("blog");
const rawPosts = rawUnsortedPosts.sort((a, b) => {
    return b.data.pubDate.getTime() - a.data.pubDate.getTime();
});
const posts = rawPosts.map((rawPost) => toPost(rawPost.data));

export { rawPosts, posts };
