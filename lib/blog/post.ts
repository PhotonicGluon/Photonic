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
    /**
     * Whether the post contains math equations.
     *
     * This enables the loading of the KaTeX CSS stylesheet.
     */
    hasMath: z.boolean().default(false),
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
export type Post = PostZod & { id: string; slug: string };

/**
 * Converts a blog post from the Zod schema representation to the actual type.
 *
 * @param post Blog post data as inferred from the Zod schema.
 * @returns Blog post data as expressed in the correct type.
 */
export function toPost(post: PostZod): Post {
    const id = slugify(post.title, { lower: true });

    const dateSlug = post.pubDate.toISOString().split("T")[0]; // Get pubDate as YYYY-MM-DD
    const slug = `${dateSlug}/${id}`;

    return { ...post, id: id, slug: slug };
}
