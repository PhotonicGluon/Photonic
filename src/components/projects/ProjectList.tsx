import { Component } from "preact";
import { useStore } from "@nanostores/preact";
import { projectItems } from "./projects_store";

import ProjectCard from "@components/projects/ProjectCard";

interface Props {}

interface State {}

export default class ProjectList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    // Lifecycle methods
    render(props: Props, state: State) {
        const $projectItems = useStore(projectItems);
        const listItems = $projectItems.displayed.map((projectInstance) => {
            return <ProjectCard id={projectInstance.id} project={projectInstance.project} />;
        });

        return <>{listItems}</>;
    }
}
