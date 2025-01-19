import { Component } from "preact";

import type { Project } from "@lib/projects/project";

import ProjectCard from "@components/projects/ProjectCard";

interface Props {
    /** IDs of the projects */
    ids: string[];
    /** Projects' data */
    projects: Project[];
}

interface State {}

export default class ProjectList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    // Lifecycle methods
    render(props: Props, state: State) {
        const listItems = props.ids.map((id, i) => {
            const project = props.projects[i];

            return <ProjectCard key={id} id={id} project={project} />;
        });

        return <>{listItems}</>;
    }
}
