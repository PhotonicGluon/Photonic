import { z } from "astro:content";

import { toTitleCase } from "@lib/misc/strings";
import { getTags, ProjectTag, type ProjectTagType } from "./tag";

/** Zod schema for project information */
export const PROJECT_SCHEMA = z.object({
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
 * Type that encapsulates project information, as inferred from the Zod schema.
 */
export type ProjectZod = z.infer<typeof PROJECT_SCHEMA>;

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
