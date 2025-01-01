import { z } from "astro:content";
import type { ZodSchema } from "astro:schema";
import { ProjectTag } from "./structures";

/**
 * Gets all project tags from the `ProjectTag` enum.
 *
 * @returns List of project tag IDs, in lowercase.
 */
function getTags(): readonly [string, ...string[]] {
    let tags = Object.keys(ProjectTag);
    tags = tags.map((tag) => tag.toLowerCase());
    return tags as [string, ...string[]];
}

/**
 * Generates the Zod schema for project information.
 *
 * @returns Project data schema.
 */
export default async function generateSchema(): Promise<ZodSchema> {
    return z.object({
        /** Project name */
        name: z.string(),
        /** Project summary */
        summary: z.string(),
        /**
         * Start and end dates of the project.
         *
         * If `end` is unspecified, that means that the project is ongoing.
         */
        dates: z.object({
            start: z.coerce.date(),
            end: z.coerce.date().optional(),
        }),
        /** List of project tags */
        tags: z.array(z.enum(getTags())),
        /**
         * Banner URL.
         *
         * If empty, will not display a banner.
         */
        banner: z.string().optional(),
        /** URLs of the project */
        urls: z.object({
            bandcamp: z.string().optional(),
            github: z.string().optional(),
            website: z.string().optional(),
        }),
        /** Path to the file containing the project's index page */
        indexPage: z.string().optional(), // TODO: Make this mandatory once the "per-project page" feature is implemented
    });
}
