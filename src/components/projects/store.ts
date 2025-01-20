import type { Project } from "@lib/projects/project";
import { ProjectTag } from "@lib/projects/tag";
import { deepMap, type BaseDeepMap } from "nanostores";

const tagsList = Object.values(ProjectTag);
export const tagNames = tagsList.map((tag) => tag.name);

export type ProjectInstance = {
    id: string;
    project: Project;
};

export const enum SortDate {
    START = 0,
    END = 1,
}

export const enum SortOrder {
    CHRONOLOGICAL = 0,
    REVERSED = 1,
}

type SortParameters = {
    date: SortDate;
    order: SortOrder;
};

export interface ProjectStoreValue extends BaseDeepMap {
    /** Current search query */
    search: string;
    /** Set of tags that should be shown */
    tags: Set<string>;
    /** Parameters for the sorting */
    sort: SortParameters;
    /** List projects that are displayed */
    displayed: ProjectInstance[];
}

export const projectStore = deepMap<ProjectStoreValue>({
    search: "",
    tags: new Set(tagNames),
    sort: { date: SortDate.END, order: SortOrder.REVERSED },
    displayed: [],
});
