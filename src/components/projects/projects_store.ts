import { deepMap, type BaseDeepMap } from "nanostores";

export interface ProjectItemsValue extends BaseDeepMap {
    /** List of IDs of the projects that are displayed */
    displayed: string[];
}

export const projectItems = deepMap<ProjectItemsValue>({
    displayed: [],
});
