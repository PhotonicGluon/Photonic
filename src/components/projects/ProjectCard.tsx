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
        const project = props.project;
        let topBlock = <span class="text-2xl font-bold">{project.name}</span>;
        if (project.banner) {
            topBlock = <img class="rounded-lg" src={project.banner} alt={`${project.name} banner`} loading="lazy" />;
        }
        const cardFront = (
            <>
                <div class="flex h-full w-full items-center justify-center">{topBlock}</div>
                <span class="duration mt-auto">
                    {toDateString(project.dates.start)} &mdash;{" "}
                    {project.dates.end ? toDateString(project.dates.end) : "Present"}
                </span>
            </>
        );

        const projectTags = project.tags.map((tag: ProjectTagType) => (
            <ProjectTag name={tag.name} colour={tag.colour} alpha={tag.alpha} />
        ));
        const cardBack = (
            <div>
                <span class="text-2xl font-bold">{project.name}</span>
                <div class="tags">{projectTags}</div>
                <p class="mt-4 text-center">{project.summary}</p>
            </div>
        );

        return (
            <div class="card h-96 w-full">
                <div
                    id={`project-${props.id}`}
                    class="card-content relative mx-auto my-0 h-full w-11/12 cursor-pointer rounded-lg border border-solid border-gray-500 bg-gray-800/75 p-3 text-center transition-transform duration-500"
                    onClick={this.onClick(props.id)}
                >
                    {/* TODO: Edit card contents */}
                    <div class="card-front absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center p-8">
                        {cardFront}
                    </div>
                    <div class="card-back absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center p-8">
                        {cardBack}
                    </div>
                </div>
            </div>
        );
    }
}
