import type { Project } from "@lib/projects/project";
import { deepMap, type BaseDeepMap } from "nanostores";

export type ProjectInstance = {
    id: string;
    project: Project;
};

export interface ProjectItemsValue extends BaseDeepMap {
    /** List projects that are displayed */
    displayed: ProjectInstance[];
}

export const projectItems = deepMap<ProjectItemsValue>({
    displayed: [],
});
