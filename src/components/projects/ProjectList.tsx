import { Component } from "preact";
import { useStore } from "@nanostores/preact";
import { projectStore } from "./store";

import ProjectCard from "@components/projects/ProjectCard";

interface Props {
    /** Optional CSS class(es) to apply */
    class?: string;
}

interface State {}

export default class ProjectList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    // Lifecycle methods
    render(props: Props, state: State) {
        const $projectStore = useStore(projectStore);
        const listItems = $projectStore.displayed.map((projectInstance) => (
            <ProjectCard id={projectInstance.id} project={projectInstance.project} />
        ));
        return (
            <div>
                <div
                    class={
                        "grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 xl:grid-cols-3 print:flex print:flex-col" +
                        ` ${props.class}`
                    }
                >
                    {listItems}
                </div>
                <div id="no-projects-message" class="hidden text-center text-2xl font-bold">
                    No projects found.
                </div>
            </div>
        );
    }
}
