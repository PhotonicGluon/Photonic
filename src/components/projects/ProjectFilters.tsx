import $ from "jquery";
import { Component } from "preact";
import { useStore } from "@nanostores/preact";

import type { ProjectTagType } from "@lib/projects/tag";
import { projectStore, SortDate, SortOrder, tagNames, type ProjectInstance } from "./store";
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

        // Sort the displayed projects
        displayed = this.sortDisplayedProjects(displayed);

        // Then set the project store
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
     * Updates the sort parameters.
     */
    updateSortParams() {
        const sortDate: SortDate = parseInt($("#sort-date").find(":selected").val()! as string);
        const sortOrder: SortOrder = parseInt($("#sort-order").find(":selected").val()! as string);
        projectStore.setKey("sort", { date: sortDate, order: sortOrder });
    }

    /**
     * Sorts the displayed projects.
     *
     * @param displayed list of project instances
     * @returns sorted list of project instances
     */
    sortDisplayedProjects(displayed: ProjectInstance[]): ProjectInstance[] {
        const sortParams = projectStore.get().sort;

        displayed.sort((a, b) => {
            const aProj = a.project;
            const bProj = b.project;

            let aDate, bDate;
            if (sortParams.date == SortDate.START) {
                aDate = aProj.dates.start.getTime();
                bDate = bProj.dates.start.getTime();
            } else {
                // END
                aDate = aProj.dates.end ? aProj.dates.end.getTime() : Date.now();
                bDate = bProj.dates.end ? bProj.dates.end.getTime() : Date.now();
            }

            const dateDelta = aDate - bDate;
            return sortParams.order == SortOrder.CHRONOLOGICAL ? dateDelta : -dateDelta;
        });

        return displayed;
    }

    /**
     * Updates the list of projects according to the selected tags.
     *
     * @param ids - IDs of the projects
     * @param projects - Projects' data
     * @param selectedTags - Set of selected tags
     */
    updateProjectList(ids: string[], projects: Project[], selectedTags: Set<string>) {
        // Keep only the projects that match any one of the selected tags
        let newDisplayedProjects: ProjectInstance[] = [];

        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const project = projects[i];

            const projectTags = new Set(project.tags.map((tag: ProjectTagType) => tag.name));
            if (selectedTags.intersection(projectTags).size != 0) {
                newDisplayedProjects.push({ id: id, project: project });
            }
        }
        newDisplayedProjects = this.sortDisplayedProjects(newDisplayedProjects);
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
    /**
     * Function that handles filter and sort option changes.
     *
     * Updates the list of selected tags, updates the query in the URL, and updates the project list
     * based on the selected tags.
     *
     * @param ids - An array of project IDs
     * @param projects - An array of project objects
     */
    onFiltersChange = (ids: string[], projects: Project[]) => () => {
        this.updateSelectedTags();
        this.updateSortParams();

        const selectedTags = new Set(projectStore.get().tags);
        this.updateProjectList(ids, projects, selectedTags);
    };

    // Lifecycle methods
    render(props: Props, state: State) {
        const $projectStore = useStore(projectStore);
        return (
            <div class="w-full pr-3">
                <span class="block font-bold">Search</span>
                <div id="search">
                    <label for="search-project" class="sr-only">
                        Search
                    </label>
                    <input
                        type="text"
                        id="search-project"
                        class="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Search for a project..."
                        required
                    />
                </div>
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
                                    onChange={this.onFiltersChange(props.ids, props.projects)}
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
                <div id="sorting">
                    <label for="sort-date" class="sr-only">
                        Date
                    </label>
                    <select
                        id="sort-date"
                        class="mb-2 block w-full appearance-none border-0 border-b-2 border-gray-700 bg-transparent px-0 py-2.5 text-sm text-gray-400 focus:border-gray-200 focus:outline-none focus:ring-0"
                        onChange={this.onFiltersChange(props.ids, props.projects)}
                    >
                        <option value={SortDate.START}>Start Date</option>
                        <option value={SortDate.END} selected>
                            End Date
                        </option>
                    </select>
                    <label for="sort-order" class="sr-only">
                        Order
                    </label>
                    <select
                        id="sort-order"
                        class="block w-full appearance-none border-0 border-b-2 border-gray-700 bg-transparent px-0 py-2.5 text-sm text-gray-400 focus:border-gray-200 focus:outline-none focus:ring-0"
                        onChange={this.onFiltersChange(props.ids, props.projects)}
                    >
                        <option value={SortOrder.CHRONOLOGICAL}>Chronological</option>
                        <option value={SortOrder.REVERSED} selected>
                            Reversed
                        </option>
                    </select>
                </div>
            </div>
        );
    }
}
