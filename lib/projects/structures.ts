/**
 * Properties of a project tag.
 */
export interface ProjectTagProperties {
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
}

/**
 * Enum of possible project tags.
 */
export const ProjectTag: { [key: string]: ProjectTagProperties } = {
    Mathematics: { name: "Mathematics", colour: "#6ba4f8", alpha: 0.5 },
    Music: { name: "Music", colour: "#9c6bdf", alpha: 0.5 },
    Programming: { name: "Programming", colour: "#64b75d", alpha: 0.5 },
    Writing: { name: "Writing", colour: "#cd733a", alpha: 0.5 },
} as const;
type ProjectTagType = (typeof ProjectTag)[keyof typeof ProjectTag];

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
