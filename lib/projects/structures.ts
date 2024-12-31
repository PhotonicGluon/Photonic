/**
 * Properties of a project tag.
 */
export interface ProjectTagProperties {
    name: string;
    colour: string;
}

/**
 * Enum of possible project tags.
 */
export const ProjectTag: { [key: string]: ProjectTagProperties } = {
    Mathematics: { name: "Mathematics", colour: "#6ba4f8" },
    Music: { name: "Music", colour: "#9c6bdf" },
    Programming: { name: "Programming", colour: "#64b75d" },
    Writing: { name: "Writing", colour: "#cd733a" },
} as const;
export type ProjectTagType = (typeof ProjectTag)[keyof typeof ProjectTag];

/**
 * Class that encapsulates project information.
 */
export interface Project {
    /**
     * Project ID.
     *
     * Will be used for the slug of the project page.
     */
    id: string;
    /** Project name */
    name: string;
    /** Project summary */
    summary: string;
    /**
     * Start and end dates of the project.
     *
     * If `end` is unspecified, that means that the project is ongoing.
     */
    dates: { start: Date; end?: Date };
    /** List of project tags */
    tags: ProjectTagType[];
    /**
     * Banner URL.
     *
     * If empty, will not display a banner.
     */
    banner?: string;
    /** URLs of the project */
    urls?: {
        bandcamp?: string;
        github?: string;
        website?: string;
    };
}
