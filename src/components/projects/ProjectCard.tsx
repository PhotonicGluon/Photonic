import { Component } from "preact";

import ProjectTag from "@components/projects/ProjectTag";

import type { ProjectTagType } from "@lib/projects/tag";
import type { Project } from "@lib/projects/project";

import { toDateString } from "@lib/misc/dates";

import "./ProjectCard.css";

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
            <div class="card h-96 w-full">
                <div
                    id={`project-${props.id}`}
                    class="card-content relative mx-auto my-0 h-full w-11/12 cursor-pointer rounded-lg border border-solid border-gray-500 bg-gray-800/75 p-3 text-center transition-transform duration-500"
                    onClick={this.onClick(props.id)}
                >
                    {/* TODO: Edit card contents */}
                    <div class="card-front absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center p-8">
                        <div>
                            <span class="block text-2xl font-bold">{props.project.name}</span>
                            <span class="duration block">
                                {toDateString(props.project.dates.start)} &mdash;{" "}
                                {props.project.dates.end ? toDateString(props.project.dates.end) : "Present"}
                            </span>
                        </div>
                    </div>
                    <div class="card-back absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center p-8">
                        <div>
                            <span class="text-2xl font-bold">{props.project.name}</span>
                            <div class="tags">
                                {props.project.tags.map((tag: ProjectTagType) => (
                                    <ProjectTag name={tag.name} colour={tag.colour} alpha={tag.alpha} />
                                ))}
                            </div>
                            <p class="text-center">{props.project.summary}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
