import { Component } from "preact";

import ProjectTag from "@components/projects/ProjectTag";

import type { ProjectTagType } from "@lib/projects/tag";

interface Props {
    /** List of project tags */
    tags: ProjectTagType[];
}

interface State {}

export default class ProjectTags extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    // Lifecycle methods
    render(props: Props, state: State) {
        return (
            <div class="mt-1 grid grid-flow-row grid-cols-1 justify-center gap-1 lg:flex">
                {props.tags.map((tag: ProjectTagType) => (
                    <ProjectTag name={tag.name} colour={tag.colour} alpha={tag.alpha} />
                ))}
            </div>
        );
    }
}
