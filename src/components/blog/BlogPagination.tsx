import { Component } from "preact";
import { useStore } from "@nanostores/preact";
import { postStore } from "./store";

import { range } from "@lib/misc/iterables";

interface Props {}

interface State {}

export default class BlogPagination extends Component<Props, State> {
    // Helper methods
    pageButton(text: string, href: string, className?: string) {
        // TODO: Clean up this code
        return (
            <li>
                <a
                    href={href}
                    class={
                        "ms-0 flex h-8 items-center justify-center border border-e-0 border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white " +
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
        return (
            <nav aria-label="Page navigation">
                <ul class="inline-flex -space-x-px text-sm">
                    {this.pageButton("Previous", "#", "rounded-s-lg") /*TODO: ADD*/}
                    {
                        /*TODO: There should be a better way of doing this... with ellipses as well...*/
                        range(numPages).map((page) => {
                            return this.pageButton((page + 1).toString(), "#"); // TODO: Set page URL
                        })
                    }
                    {this.pageButton("Next", "#", "rounded-e-lg") /*TODO: ADD*/}
                </ul>
            </nav>
        );
    }
}
