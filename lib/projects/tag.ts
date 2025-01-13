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
    Mathematics: { name: "Mathematics", colour: "#0ea5e9", alpha: 0.6 }, // Sky 500
    Music: { name: "Music", colour: "#6366f1", alpha: 0.6 }, // Indigo 500
    Programming: { name: "Programming", colour: "#10b981", alpha: 0.6 }, // Emerald 500
    Writing: { name: "Writing", colour: "#8b5cf6", alpha: 0.6 }, // Violet 500
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
