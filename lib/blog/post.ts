import { z } from "astro:content";
import slugify from "slugify";

/** Zod schema for blog post information */
export const POST_SCHEMA = z.object({
    /** Title of the post */
    title: z.string(),
    /** Publication date */
    pubDate: z.coerce.date(),
    /** Blog post summary */
    summary: z.string(),
    /** Optional cover image for the post */
    image: z
        .object({
            /** URL to the image */
            url: z.string(),
            /** Alt info for the image */
            alt: z.string(),
        })
        .optional(),
    /** Optional list of tags to attach to the post; TODO: Implement */
    tags: z.array(z.string()).optional(),
});

/**
 * Type that encapsulates the blog post information, as inferred from the Zod schema.
 */
export type PostZod = z.infer<typeof POST_SCHEMA>;

// TODO: May use this in the future
// type PostInCollection = DataEntryMap["blog"][0];

/**
 * Type that encapsulates blog post information.
 */
export type Post = PostZod & { id: string; url: string };

/**
 * Given a blog post, returns the ID of the post.
 *
 * @param post The blog post
 * @returns The ID of the post
 */
export function getPostID(post: PostZod): string {
    return slugify(post.title, { lower: true });
}

/**
 * Given a blog post, returns the URL that should be used to access the post.
 *
 * @param post The blog post
 * @returns The URL of the post
 */
export function getPostURL(post: PostZod): string {
    return `/blog/${getPostID(post)}`; // TODO: Add a date YYYY-MM-DD
}
/**
 * Converts a blog post from the Zod schema representation to the actual type.
 *
 * @param post Blog post data as inferred from the Zod schema.
 * @returns Blog post data as expressed in the correct type.
 */
export function toPost(post: PostZod): Post {
    return { ...post, id: getPostID(post), url: getPostURL(post) };
}
