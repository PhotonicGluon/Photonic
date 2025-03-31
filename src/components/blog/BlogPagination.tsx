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
     * @param disabled Whether the button should be disabled or not.
     * @returns Button element.
     */
    pageButton(text: string, href: string, className?: string, disabled: boolean = false) {
        function click(e: MouseEvent) {
            e.preventDefault();
            if (disabled) return;
            window.history.pushState({}, "", href);
            window.dispatchEvent(new Event("locationchange"));
        }

        return (
            <li>
                <a
                    onClick={click}
                    href={!disabled ? href : undefined}
                    class={
                        "ms-0 flex h-8 items-center justify-center border border-gray-700 px-3 leading-tight " +
                        (disabled
                            ? "bg-gray-900 !text-gray-400 hover:!cursor-default"
                            : "bg-gray-800 !text-gray-300 hover:bg-gray-700 hover:!text-white") +
                        " " +
                        `${className ? className : ""}`
                    }
                >
                    {text}
                </a>
            </li>
        );
    }

    makePageQuery(page: number) {
        return `?page=${page + 1}`;
    }

    // Lifecycle methods
    render(props: Props, state: State) {
        const $postStore = useStore(postStore);
        const numPages = $postStore.numPages;
        const currPage = $postStore.page;

        return (
            <nav aria-label="Page navigation">
                <ul class="inline-flex -space-x-px text-sm">
                    {this.pageButton("Previous", this.makePageQuery(currPage - 1), "rounded-s-lg", currPage < 1)}
                    {
                        /*TODO: There should be a better way of doing this... with ellipses as well...*/
                        range(numPages).map((pageIdx) => {
                            return this.pageButton(
                                (pageIdx + 1).toString(),
                                this.makePageQuery(pageIdx),
                                "",
                                pageIdx == currPage,
                            );
                        })
                    }
                    {this.pageButton(
                        "Next",
                        this.makePageQuery(currPage + 1),
                        "rounded-e-lg",
                        currPage >= numPages - 1,
                    )}
                </ul>
            </nav>
        );
    }
}
