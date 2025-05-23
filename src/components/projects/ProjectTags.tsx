import { Component } from "preact";

import ProjectTag from "@components/projects/ProjectTag";

import type { ProjectTagType } from "@lib/projects/tag";

interface Props {
    /** Optional CSS class(es) to apply */
    class?: string;
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
            <div
                class={
                    "mt-1 grid grid-flow-row grid-cols-1 justify-items-center gap-1 md:flex md:justify-center" +
                    ` ${props.class}`
                }
            >
                {props.tags.map((tag: ProjectTagType) => (
                    <ProjectTag name={tag.name} colour={tag.colour} alpha={tag.alpha} />
                ))}
            </div>
        );
    }
}
