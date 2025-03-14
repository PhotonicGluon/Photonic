/**
 * Interface that enforces the items that must be present on the frontmatter.
 */
export interface PostFrontmatter {
    /** Title of the post */
    title: string;
    /** Publication date in the form "YYYY-MM-DD" */
    pubDate: string;
    /** Blog post summary */
    summary: string;
    /** Optional cover image for the post */
    image: {
        /** URL to the image */
        url: string;
        /** Alt info for the image */
        alt: string;
    };
    /** Optional list of tags to attach to the post */
    tags?: string[];
}

/**
 * Interface that specifies the required items on a post collection item.
 */
export interface Post {
    /** URL of the page */
    url: string;
    /** Frontmatter of the post */
    frontmatter: PostFrontmatter;

    /* Allow other properties */
    [other: string | number | symbol]: unknown;
}
