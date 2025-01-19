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
    id: string;
    project: Project;

    constructor(props: Props) {
        super(props);
        this.id = props.id;
        this.project = props.project;
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
                id={`project-${this.id}`}
                class="mx-auto my-0 w-[90%] cursor-pointer rounded-xl border border-solid border-white p-[10px] text-center"
                onClick={this.onClick(this.id)}
            >
                {/* TODO: Edit card contents */}
                {/* TODO: Make card intractable (i.e., flip card to see summary) */}
                <span class="text-2xl font-bold">{this.project.name}</span>
                <div class="tags">
                    {this.project.tags.map((tag: ProjectTagType) => (
                        <ProjectTag name={tag.name} colour={tag.colour} alpha={tag.alpha} />
                    ))}
                </div>
                <span class="duration">
                    {toDateString(this.project.dates.start)} &mdash;{" "}
                    {this.project.dates.end ? toDateString(this.project.dates.end) : "Present"}
                </span>
                <p class="summary">{this.project.summary}</p>
            </div>
        );
    }
}
