import { Component } from "preact";
import { useStore } from "@nanostores/preact";
import { postStore } from "./store";

import { range } from "@lib/misc/iterables";

interface Props {}

interface State {}

export default class BlogPagination extends Component<Props, State> {
    // Helper methods
    /**
     * Creates a page button.
     *
     * @param text Text to display.
     * @param href URL to link to.
     * @param className Additional classes to add to the button.
     * @returns Button element.
     */
    pageButton(text: string, href: string, className?: string) {
        function click(e: MouseEvent) {
            e.preventDefault();
            window.history.pushState({}, "", href);
            window.dispatchEvent(new Event("locationchange"));
        }

        return (
            <li>
                <a
                    onClick={click}
                    href={href}
                    class={
                        "ms-0 flex h-8 items-center justify-center border border-gray-700 bg-gray-800 px-3 leading-tight text-gray-400 hover:bg-gray-700 hover:text-white " +
                        `${className ? className : ""}`
                    }
                >
                    {text}
                </a>
            </li>
        );
    }

    // Lifecycle methods
    render(props: Props, state: State) {
        const $postStore = useStore(postStore);
        const numPages = Math.ceil($postStore.posts.length / $postStore.numPerPage);
        console.log(numPages);
        return (
            <nav aria-label="Page navigation">
                <ul class="inline-flex -space-x-px text-sm">
                    {this.pageButton("Previous", "#", "rounded-s-lg") /*TODO: ADD*/}
                    {
                        /*TODO: There should be a better way of doing this... with ellipses as well...*/
                        range(numPages).map((page) => {
                            return this.pageButton((page + 1).toString(), `?page=${page + 1}`);
                        })
                    }
                    {this.pageButton("Next", "#", "rounded-e-lg") /*TODO: ADD*/}
                </ul>
            </nav>
        );
    }
}
