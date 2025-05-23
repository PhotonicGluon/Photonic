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

    // Store methods
    /**
     * Updates the search query in the story.
     */
    updateSearch() {
        projectStore.setKey("search", $("#search-project").val()! as string);
    }

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

    // Helper methods
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
        // First fill in the displayed projects
        let displayedProjects: ProjectInstance[] = [];
        for (let i = 0; i < ids.length; i++) {
            displayedProjects.push({ id: ids[i], project: projects[i] });
        }

        // Filter by search
        const search = projectStore.get().search;
        if (search !== "") {
            let newDisplayedProjects: ProjectInstance[] = [];
            displayedProjects.forEach((projectInstance) => {
                if (projectInstance.project.name.toLowerCase().includes(search.toLowerCase())) {
                    newDisplayedProjects.push(projectInstance);
                }
            });
            displayedProjects = newDisplayedProjects;
        }

        // Then keep only the projects that match any one of the selected tags
        let newDisplayedProjects: ProjectInstance[] = [];
        displayedProjects.forEach((projectInstance) => {
            const id = projectInstance.id;
            const project = projectInstance.project;

            const projectTags = new Set(project.tags.map((tag: ProjectTagType) => tag.name));
            if (selectedTags.intersection(projectTags).size != 0) {
                newDisplayedProjects.push({ id: id, project: project });
            }
        });

        // Sort the projects
        newDisplayedProjects = this.sortDisplayedProjects(newDisplayedProjects);
        projectStore.setKey("displayed", newDisplayedProjects);

        // Check if any projects are left
        const noProjectsMessage = $("#no-projects-message")[0];
        if (newDisplayedProjects.length == 0) {
            noProjectsMessage.classList.remove("hidden");
        } else if (!noProjectsMessage.classList.contains("hidden")) {
            noProjectsMessage.classList.add("hidden");
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
        // Update store details
        this.updateSearch();
        this.updateSelectedTags();
        this.updateSortParams();

        // Update project list
        const selectedTags = new Set(projectStore.get().tags);
        this.updateProjectList(ids, projects, selectedTags);
    };

    // Lifecycle methods
    render(props: Props, state: State) {
        const $projectStore = useStore(projectStore);
        return (
            <div class="grid w-full grid-cols-2 gap-x-2 lg:block">
                <span class="hidden font-bold lg:block">Search</span>
                <div class="col-span-2 pt-3 lg:pt-0" id="search">
                    <label for="search-project" class="sr-only">
                        Search
                    </label>
                    <input
                        type="text"
                        id="search-project"
                        class="block w-full rounded-lg border border-gray-600 bg-gray-700 p-1.5 text-xs text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 md:p-2.5 md:text-sm"
                        placeholder="Search for a project..."
                        onInput={this.onFiltersChange(props.ids, props.projects)}
                        required
                    />
                </div>
                <span class="hidden pt-3 font-bold lg:block">Tags</span>
                <div class="flex flex-col gap-1 pt-3 lg:gap-0 lg:pt-0" id="tags">
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
                                <label for={checkboxID} class="ms-2 text-xs font-medium md:text-sm">
                                    {tagName}
                                </label>
                            </div>
                        );
                    })}
                </div>
                <span class="hidden pt-3 font-bold lg:block">Sorting</span>
                <div class="pt-3 lg:pt-0" id="sorting">
                    <label for="sort-date" class="sr-only">
                        Date
                    </label>
                    <select
                        id="sort-date"
                        class="mb:py-2.5 mb-2 block w-full appearance-none border-0 border-b-2 border-gray-700 bg-transparent px-0 py-1.5 text-xs text-gray-400 focus:border-gray-200 focus:ring-0 focus:outline-none md:text-sm"
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
                        class="mb:py-2.5 block w-full appearance-none border-0 border-b-2 border-gray-700 bg-transparent px-0 py-1.5 text-xs text-gray-400 focus:border-gray-200 focus:ring-0 focus:outline-none md:text-sm"
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
