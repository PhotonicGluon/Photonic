import { z } from "astro:content";
import type { ZodSchema } from "astro:schema";

import { toTitleCase } from "@lib/misc/strings";

/**
 * Properties of a project tag.
 */
export type ProjectTagProperties = {
    /** Tag name */
    name: string;
    /** Hex code for the tag's colour */
    colour: string;
    /**
     * Alpha of the tag's background.
     *
     * Must be between 0 and 1 inclusive.
     */
    alpha: number;
};

/**
 * Enum of possible project tags.
 */
export const ProjectTag: { [key: string]: ProjectTagProperties } = {
    Mathematics: { name: "Mathematics", colour: "#6ba4f8", alpha: 0.5 },
    Music: { name: "Music", colour: "#9c6bdf", alpha: 0.5 },
    Programming: { name: "Programming", colour: "#64b75d", alpha: 0.5 },
    Writing: { name: "Writing", colour: "#cd733a", alpha: 0.5 },
} as const;

/** Type of a project tag */
type ProjectTagType = (typeof ProjectTag)[keyof typeof ProjectTag];

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

/** Zod schema for project information */
const SCHEMA = z.object({
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
    /**
     * Optional path to the file containing the project's index page.
     *
     * If not provided, expects an `.astro` file in the `src/pages/projects` folder with the
     * same ID as the project.
     */
    indexPage: z.string().optional(),
});

/**
 * Generates the Zod schema for project information.
 *
 * @returns Project data schema.
 */
export default async function generateSchema(): Promise<ZodSchema> {
    return SCHEMA;
}

/**
 * Type that encapsulates project information, as inferred from the Zod schema.
 */
export type ProjectZod = z.infer<typeof SCHEMA>;

/**
 * Type that encapsulates project information.
 */
export type Project = Omit<ProjectZod, "tags"> & { tags: ProjectTagType[] };

/**
 * Converts a project from the Zod schema representation to the actual type.
 *
 * @param project - Project data as inferred from the Zod schema.
 * @returns Project data with the tags converted to the actual type.
 */
export function toProject(project: ProjectZod): Project {
    // Only thing of concern is that the tags are wrong
    let correctTags: ProjectTagType[] = [];
    project.tags.forEach((tag) => {
        let correctTag: ProjectTagType | undefined = ProjectTag[toTitleCase(tag)];
        if (correctTag === undefined) {
            throw Error(`Unknown tag ${tag}`);
        }
        correctTags.push(correctTag);
    });

    // We can now return the correct project
    return {
        ...project,
        tags: correctTags,
    };
}
