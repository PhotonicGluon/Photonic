import { Component } from "preact";

import ProjectTags from "@components/projects/ProjectTags";

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
        const project = props.project;

        let topBlock = <span class="text-2xl font-bold">{project.name}</span>;
        if (project.banner) {
            topBlock = (
                <img
                    class="max-h-full rounded-lg"
                    src={project.banner}
                    alt={`${project.name} banner`}
                    loading="lazy"
                />
            );
        }
        const cardFront = (
            <>
                <div class="flex h-full w-full flex-col items-center justify-center">
                    <div class="max-h-full">{topBlock}</div>
                    <ProjectTags tags={project.tags}></ProjectTags>
                </div>

                <span class="mt-auto">
                    {toDateString(project.dates.start)} &mdash;{" "}
                    {project.dates.end ? toDateString(project.dates.end) : "Present"}
                </span>
            </>
        );

        const cardBack = (
            <div>
                <span class="text-2xl font-bold">{project.name}</span>
                <p class="mt-4 !text-center">{project.summary}</p>
            </div>
        );

        return (
            <div class="card h-96 w-full max-w-96">
                <div
                    id={`project-${props.id}`}
                    class="card-content group relative mx-auto my-0 h-full w-11/12 cursor-pointer rounded-lg bg-gradient-to-tr from-gray-900 via-slate-700 via-75% to-gray-800 p-3 text-center transition-transform duration-500 motion-reduce:*:transition-opacity motion-reduce:*:duration-300"
                    onClick={this.onClick(props.id)}
                >
                    <div class="card-front absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center p-8 motion-reduce:opacity-100 motion-reduce:group-hover:opacity-0">
                        {cardFront}
                    </div>
                    <div class="card-back absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center p-8 motion-reduce:opacity-0 motion-reduce:group-hover:opacity-100">
                        {cardBack}
                    </div>
                </div>
            </div>
        );
    }
}
