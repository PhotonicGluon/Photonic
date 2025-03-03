import { Component } from "preact";

import ProjectTags from "@components/projects/ProjectTags";

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
        const project = props.project;

        let topBlock = <span class="text-2xl font-bold">{project.name}</span>;
        if (project.banner) {
            // TODO: Can we use Astro's Image component?
            topBlock = (
                <img
                    class="max-h-40 rounded-lg lg:max-h-screen"
                    src={project.banner}
                    alt={`${project.name} banner`}
                    loading="lazy"
                />
            );
        }
        const cardFront = (
            <div>
                <div class="flex h-full w-full flex-col items-center justify-center">
                    <div class="max-h-full">{topBlock}</div>
                    <ProjectTags tags={project.tags} />
                </div>

                <div class="mt-auto inline-block *:text-sm *:lg:text-base">
                    <span>{toDateString(project.dates.start)} </span>
                    <span class="hidden md:inline">&mdash;</span>
                    <span class="inline md:hidden">-</span>
                    <span> {project.dates.end ? toDateString(project.dates.end) : "Present"}</span>
                </div>
            </div>
        );

        const cardBack = (
            <div>
                <span class="text-2xl font-bold">{project.name}</span>
                <p class="mt-4 !text-center">{project.summary}</p>
            </div>
        );

        return (
            <div class="group h-64 w-full motion-safe:perspective-distant lg:h-96 lg:max-w-96">
                <div
                    id={`project-${props.id}`}
                    class="relative mx-auto my-0 h-full w-full cursor-pointer rounded-lg bg-gradient-to-tr from-gray-900 via-slate-700 via-75% to-gray-800 p-3 text-center transition-transform duration-500 *:absolute *:top-0 *:right-0 *:bottom-0 *:left-0 *:flex *:flex-col *:items-center *:justify-center *:p-4 motion-safe:transform-3d motion-safe:*:rotate-x-0 motion-safe:*:backface-hidden motion-reduce:*:transition-opacity motion-reduce:*:duration-300 md:motion-safe:group-hover:rotate-y-180 *:lg:p-8"
                    onClick={this.onClick(props.id)}
                >
                    <div class="motion-reduce:opacity-100 motion-reduce:group-hover:opacity-0">{cardFront}</div>
                    <div class="hidden motion-safe:rotate-y-180 motion-reduce:opacity-0 motion-reduce:group-hover:opacity-100 md:visible">
                        {cardBack}
                    </div>
                </div>
            </div>
        );
    }
}
