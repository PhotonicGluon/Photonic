import { formatRGBA, hexToRGBA } from "@lib/misc/colours";
import { Component } from "preact";

import "./ProjectTag.css";

interface Props {
    /** Name of the tag */
    name: string;
    /** Base hex colour of the tag */
    colour: string;
    /** Alpha of the tag's background */
    alpha: number;
}

interface State {}

export default class ProjectTag extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    // Lifecycle methods
    render(props: Props, state: State) {
        return (
            <span
                class="tag m-1 inline-flex h-3 flex-wrap content-center rounded-lg border border-solid p-3 text-base last:m-0"
                style={{
                    "--baseColour": formatRGBA(hexToRGBA(props.colour)),
                    "--backgroundColour": formatRGBA(hexToRGBA(props.colour, props.alpha)),
                }}
            >
                {props.name}
            </span>
        );
    }
}
