import $ from "jquery";
import { Component } from "preact";

interface Props {}

interface State {}

export default class ScrollToTopButton extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    // Operation methods
    onClick = () => () => {
        $("html, body").animate({ scrollTop: 0 }, "slow");
    };

    // Lifecycle methods
    render(props: Props, state: State) {
        // TODO: Hide button if not scrolled far enough
        return (
            <div
                class="fixed right-10 bottom-20 z-50 flex size-10 items-center justify-center rounded-full bg-cyan-800 shadow-xl transition-colors duration-100 hover:cursor-pointer hover:bg-cyan-900 md:size-12 lg:size-16 xl:right-20"
                onClick={this.onClick()}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6 md:size-7 lg:size-10"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
            </div>
        );
    }
}
