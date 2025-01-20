import { Component } from "preact";

import ProjectTag from "@components/projects/ProjectTag";

import type { ProjectTagType } from "@lib/projects/tag";
import type { Project } from "@lib/projects/project";

import { toDateString } from "@lib/misc/dates";

interface Props {
    /** ID of the project */
    id: string;
    /** Project data */
    project: Project;
}

interface State {}

export default class ProjectFilters extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    // Operation methods
    onClick = (id: string) => () => {
        window.location.href = `/projects/${id}`;
    };

    // Lifecycle methods
    render(props: Props, state: State) {
        return (
            <div
                id={`project-${props.id}`}
                class="mx-auto my-0 w-11/12 cursor-pointer rounded-lg border border-solid border-gray-500 bg-gray-800/75 p-3 text-center"
                onClick={this.onClick(props.id)}
            >
                {/* TODO: Edit card contents */}
                {/* TODO: Make card intractable (i.e., flip card to see summary) */}
                <span class="text-2xl font-bold">{props.project.name}</span>
                <div class="tags">
                    {props.project.tags.map((tag: ProjectTagType) => (
                        <ProjectTag name={tag.name} colour={tag.colour} alpha={tag.alpha} />
                    ))}
                </div>
                <span class="duration">
                    {toDateString(props.project.dates.start)} &mdash;{" "}
                    {props.project.dates.end ? toDateString(props.project.dates.end) : "Present"}
                </span>
                <p class="summary">{props.project.summary}</p>
            </div>
        );
    }
}
