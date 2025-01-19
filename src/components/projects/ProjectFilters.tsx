import $ from "jquery";
import { Component } from "preact";

import { ProjectTag, type ProjectTagType } from "@lib/projects/tag";
import { projectItems, type ProjectInstance } from "./projects_store";
import type { Project } from "@lib/projects/project";

const tags = Object.values(ProjectTag);

interface Props {
    /** IDs of the projects */
    ids: string[];
    /** Projects' data */
    projects: Project[];
}

interface State {
    selectedTags: Set<string>;
}

export default class ProjectFilters extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedTags: new Set(tags.map((tag) => tag.name)),
        };
    }

    // Helper methods
    /**
     * @returns Set of selected tags
     */
    getSelectedTags(): Set<string> {
        let selectedTagsArray: string[] = [];

        $("#tags input[type=checkbox]:checked").each((_, checkbox) => {
            selectedTagsArray.push((checkbox as HTMLInputElement).value);
        });

        let selectedTags = new Set(selectedTagsArray);
        this.setState((prev) => ({ selectedTags: selectedTags }));
        return selectedTags;
    }

    /**
     * Function that handles updates to the project list on filter condition changes.
     */
    updateProjectList = (projectIDs: string[], projects: any[], state: State) => () => {
        // Get selected tags, showing the projects that match
        const selectedTags = this.getSelectedTags();
        let newDisplayedProjects: ProjectInstance[] = [];

        for (let i = 0; i < projectIDs.length; i++) {
            const id = projectIDs[i];
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

        projectItems.setKey("displayed", newDisplayedProjects);

        // Check if any projects are left
        if (newDisplayedProjects.length == 0) {
            // TODO: This is quite ugly... can we do better?
            $("#projects").append(
                `<div id="no-projects-message" class="text-center text-2xl font-bold col-span-full">No projects match your filters.</div>`,
            );
        } else {
            $("#no-projects-message").remove();
        }
    };

    // Lifecycle methods
    render(props: Props, state: State) {
        // Render current component
        return (
            <>
                <span class="block font-bold">Search</span>
                <div>(Future search box...)</div>
                <span class="block pt-3 font-bold">Tags</span>
                <div id="tags">
                    {tags.map((tag) => {
                        const checkboxID = "filter-tag-" + tag.name.toLowerCase();
                        return (
                            <div class="flex items-center">
                                <input
                                    id={checkboxID}
                                    type="checkbox"
                                    value={tag.name}
                                    class="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 ring-offset-gray-800 focus:ring-2 focus:ring-blue-500"
                                    onClick={this.updateProjectList(props.ids, props.projects, state)}
                                    checked={state.selectedTags.has(tag.name)}
                                />
                                <label for={checkboxID} class="ms-2 text-sm font-medium">
                                    {tag.name}
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
