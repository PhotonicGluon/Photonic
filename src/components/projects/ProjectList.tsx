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
        const listItems = $projectStore.displayed.map((projectInstance) => {
            return <ProjectCard id={projectInstance.id} project={projectInstance.project} />;
        });
        return (
            <div
                class={
                    "grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 xl:grid-cols-3" + ` ${props.class}`
                }
            >
                {listItems}
            </div>
        );
    }
}
