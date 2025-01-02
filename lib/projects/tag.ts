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
export type ProjectTagType = (typeof ProjectTag)[keyof typeof ProjectTag];

/**
 * Gets all project tags from the `ProjectTag` enum.
 *
 * @returns List of project tag IDs, in lowercase.
 */
export function getTags(): readonly [string, ...string[]] {
    let tags = Object.keys(ProjectTag);
    tags = tags.map((tag) => tag.toLowerCase());
    return tags as [string, ...string[]];
}
