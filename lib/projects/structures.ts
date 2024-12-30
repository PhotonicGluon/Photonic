/**
 * Enum of possible project tags.
 */
export enum ProjectTag {
    Mathematics,
    Music,
    Programming,
    Writing,
}

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
    tags: ProjectTag[];
    /**
     * Banner URL.
     *
     * If empty, will not display a banner.
     */
    banner?: string;
    /** URLs of the project */
    urls: {
        bandcamp?: string;
        github?: string;
        website?: string;
    };
}
