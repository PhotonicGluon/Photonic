import { getCollection } from "astro:content";
import { toPost } from "./post";

// Load all blog posts, sorting them by date
const rawUnsortedPosts = await getCollection("blog");
const rawPosts = rawUnsortedPosts.sort((a, b) => {
    return b.data.pubDate.getTime() - a.data.pubDate.getTime();
});
const posts = rawPosts.map((rawPost) => toPost(rawPost.data));

export { rawPosts, posts };
