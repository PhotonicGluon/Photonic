import $ from "jquery";
import { Component } from "preact";
import { useStore } from "@nanostores/preact";

import type { ProjectTagType } from "@lib/projects/tag";
import { projectStore, tagNames, type ProjectInstance } from "./store";
import type { Project } from "@lib/projects/project";

interface Props {
    /** IDs of the projects */
    ids: string[];
    /** Projects' data */
    projects: Project[];
}

interface State {}

export default class ProjectFilters extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        // Update store to use initial projects
        let displayed: any[] = [];
        for (let i = 0; i < props.ids.length; i++) {
            displayed.push({ id: props.ids[i], project: props.projects[i] });
        }
        projectStore.setKey("displayed", displayed);
    }

    // Helper methods
    /**
     * Updates the list of selected tags.
     */
    updateSelectedTags() {
        let selectedTagsArray: string[] = [];
        $("#tags input[type=checkbox]:checked").each((_, checkbox) => {
            selectedTagsArray.push((checkbox as HTMLInputElement).value);
        });
        projectStore.setKey("tags", new Set(selectedTagsArray));
    }

    /**
     * Function that handles updates to the project list on filter condition changes.
     */
    updateProjectList(ids: string[], projects: any[], selectedTags: Set<string>) {
        // Keep only the projects that match any one of the selected tags
        let newDisplayedProjects: ProjectInstance[] = [];

        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const project = projects[i];

            const projectTags = new Set(project.tags.map((tag: ProjectTagType) => tag.name));

            const cardID = `#project-${id}`;
            if (selectedTags.intersection(projectTags).size == 0) {
                $(cardID).hide();
            } else {
                $(cardID).show();
                newDisplayedProjects.push({ id: id, project: project });
            }
        }
        projectStore.setKey("displayed", newDisplayedProjects);

        // Check if any projects are left
        if (newDisplayedProjects.length == 0) {
            // TODO: This is quite ugly... can we do better?
            $("#projects").append(
                `<div id="no-projects-message" class="text-center text-2xl font-bold col-span-full">No projects match your filters.</div>`,
            );
        } else {
            $("#no-projects-message").remove();
        }
    }

    // Operational methods
    onFilterClick = (ids: string[], projects: any[]) => () => {
        this.updateSelectedTags();
        const selectedTags = new Set(projectStore.get().tags);

        // Update query in URL
        const newURL = new URL(window.location.href);
        newURL.searchParams.set("filter", Array.from(selectedTags).join(","));
        window.history.pushState({}, "", newURL.toString());

        // Update project list
        this.updateProjectList(ids, projects, selectedTags);
    };

    // Lifecycle methods
    render(props: Props, state: State) {
        const $projectStore = useStore(projectStore);
        return (
            <>
                <span class="block font-bold">Search</span>
                <div>(Future search box...)</div>
                <span class="block pt-3 font-bold">Tags</span>
                <div id="tags">
                    {tagNames.map((tagName) => {
                        const checkboxID = "filter-tag-" + tagName.toLowerCase();
                        return (
                            <div class="flex items-center">
                                <input
                                    id={checkboxID}
                                    type="checkbox"
                                    value={tagName}
                                    class="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 ring-offset-gray-800 focus:ring-2 focus:ring-blue-500"
                                    onChange={this.onFilterClick(props.ids, props.projects)}
                                    checked={$projectStore.tags.has(tagName)}
                                />
                                <label for={checkboxID} class="ms-2 text-sm font-medium">
                                    {tagName}
                                </label>
                            </div>
                        );
                    })}
                </div>
                <span class="block pt-3 font-bold">Sorting</span>
                <div>List of sorting options...</div>
            </>
        );
    }
}
