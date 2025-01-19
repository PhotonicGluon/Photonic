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
    baseColour: string;
    backgroundColour: string;

    constructor(props: Props) {
        super(props);

        this.baseColour = formatRGBA(hexToRGBA(props.colour));
        this.backgroundColour = formatRGBA(hexToRGBA(props.colour, props.alpha));
    }

    // Lifecycle methods
    render(props: Props, state: State) {
        const tag = (
            <span class="tag" style={{ "--baseColour": this.baseColour, "--backgroundColour": this.backgroundColour }}>
                {props.name}
            </span>
        );

        return tag;
    }
}
