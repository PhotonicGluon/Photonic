import $ from "jquery";
import { Component } from "preact";

const SCROLL_SHOW_THRESHOLD = 0.5; // Fraction of the view height to scroll down before the button shows up

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

    // Main methods
    /**
     * Checks the scroll amount on the webpage, and updates the `showing` state if it passes the
     * `SCROLL_SHOW_THRESHOLD`
     */
    checkScroll() {
        const windowElem = $(window);
        const scrollTop = windowElem.scrollTop()!;

        // Show when scrolled half page height
        if (scrollTop > windowElem.innerHeight()! * SCROLL_SHOW_THRESHOLD) {
            this.setState({ showing: true });
        } else {
            this.setState({ showing: false });
        }
    }

    // Operation methods
    onClick = () => () => {
        if (!this.state.showing) return;
        $("html, body").animate({ scrollTop: 0 }, "slow");
    };

    // Lifecycle methods
    componentDidMount() {
        $(window).on("scroll", () => {
            this.checkScroll();
        });
        this.checkScroll();
    }

    render(props: Props, state: State) {
        return (
            <div
                class={
                    "fixed right-4 bottom-20 z-50 flex size-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-800 to-blue-600 shadow-xl transition-all duration-200 hover:bg-cyan-900 lg:size-14 xl:right-20 print:hidden " +
                    (this.state.showing ? "opacity-100 hover:cursor-pointer" : "opacity-0")
                }
                onClick={this.onClick()}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-7 lg:size-8"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
            </div>
        );
    }
}
