import type { Project } from "@lib/projects/project";
import { ProjectTag } from "@lib/projects/tag";
import { deepMap, type BaseDeepMap } from "nanostores";

export const tagsList = Object.values(ProjectTag);

export type ProjectInstance = {
    id: string;
    project: Project;
};

export interface ProjectStoreValue extends BaseDeepMap {
    /** Set of tags that should be shown */
    tags: Set<string>;
    /** List projects that are displayed */
    displayed: ProjectInstance[];
}

export const projectStore = deepMap<ProjectStoreValue>({
    tags: new Set(tagsList.map((tag) => tag.name)),
    displayed: [],
});
