import { formatRGBA, hexToRGBA } from "@lib/misc/colours";
import { Component } from "preact";

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
                class="w-min rounded-lg border border-solid border-(--baseColour) bg-(--backgroundColour) px-3 text-base"
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
