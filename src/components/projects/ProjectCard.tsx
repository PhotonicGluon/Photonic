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
            // TODO: We can do better with the card design... especially the 90% width...
            <div
                id={`project-${props.id}`}
                class="mx-auto my-0 w-[90%] cursor-pointer rounded-xl border border-solid border-white p-[10px] text-center"
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
