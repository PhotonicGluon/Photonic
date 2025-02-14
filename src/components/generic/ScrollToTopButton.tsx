import $ from "jquery";
import { Component } from "preact";

interface Props {}

interface State {
    /** Whether the button is showing or not */
    showing: boolean;
}

export default class ScrollToTopButton extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { showing: false };
    }

    // Operation methods
    onClick = () => () => {
        $("html, body").animate({ scrollTop: 0 }, "slow");
    };

    // Lifecycle methods
    componentDidMount() {
        $(window).on("scroll", () => {
            const scrollTop = $(window).scrollTop()!;
            if (scrollTop > $(window).innerHeight()!) {
                this.setState({ showing: true });
            } else {
                this.setState({ showing: false });
            }
            console.log(this.state);
        });
    }

    render(props: Props, state: State) {
        return (
            <div
                class={
                    "fixed right-10 bottom-20 z-50 flex size-10 items-center justify-center rounded-full bg-cyan-800 shadow-xl transition-colors duration-100 hover:cursor-pointer hover:bg-cyan-900 md:size-12 lg:size-16 xl:right-20 " +
                    (this.state.showing ? "opacity-100" : "opacity-0") // TODO: This way of hiding is cursed
                }
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
