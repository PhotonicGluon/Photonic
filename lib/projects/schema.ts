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
        name: z.string(),
        summary: z.string(),
        dates: z.object({
            start: z.coerce.date(),
            end: z.coerce.date().optional(),
        }),
        tags: z.array(z.enum(getTags())),
        banner: z.string().optional(),
        urls: z.object({
            bandcamp: z.string().optional(),
            github: z.string().optional(),
            website: z.string().optional(),
        }),
    });
}
