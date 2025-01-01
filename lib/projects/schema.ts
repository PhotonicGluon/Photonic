import { z } from "astro:content";
import type { ZodSchema } from "astro:schema";

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
        tags: z.array(z.enum(["mathematics", "music", "programming", "writing"])), // TODO: Use predefined tags
        banner: z.string().optional(),
        urls: z.object({
            bandcamp: z.string().optional(),
            github: z.string().optional(),
            website: z.string().optional(),
        }),
    });
}
