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
     * @param content Button content.
     * @param label Button's aria label.
     * @param href URL to link to.
     * @param className Additional classes to add to the button.
     * @param nonDisabledClassName Additional classes to add to the button if it is not disabled.
     * @param options Whether to disable the button, and whether to hide the button if disabled.
     * @returns Button element.
     */
    pageButton(
        content: preact.JSX.Element,
        label: string,
        href: string,
        className: string,
        nonDisabledClassName: string,
        options: {
            disabled?: boolean;
            hide_too?: boolean;
        } = { disabled: false, hide_too: false },
    ) {
        return (
            <div class="*:ms-0 *:flex *:size-12 *:items-center *:justify-center *:px-3 *:leading-tight">
                {!options.disabled && (
                    <a
                        href={href}
                        class={
                            "!text-gray-300 " +
                            `${className ? className : ""} ${nonDisabledClassName ? nonDisabledClassName : ""}`
                        }
                        aria-label={label}
                    >
                        {content}
                    </a>
                )}
                {options.disabled && (
                    <div
                        class={
                            "bg-gray-900 text-gray-400 " +
                            (options.hide_too ? "opacity-0" : "") +
                            " " +
                            `${className ? className : ""}`
                        }
                    >
                        {content}
                    </div>
                )}
            </div>
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
            <nav class="w-min" aria-label="Page navigation">
                <div class="inline-flex gap-2 -space-x-px !pb-0">
                    {/* Previous page button */}
                    {this.pageButton(
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                            />
                        </svg>,
                        "Previous Page",
                        this.makePageQuery(currPage - 1),
                        "rounded-full",
                        "hover:!text-white",
                        { disabled: currPage < 1, hide_too: true },
                    )}

                    {/* Standard page buttons */}
                    {
                        /* TODO: There should be a better way of doing this... with ellipses as well... */
                        range(numPages).map((pageIdx) => {
                            return this.pageButton(
                                <span>{(pageIdx + 1).toString()}</span>,
                                `Page ${pageIdx + 1}`,
                                this.makePageQuery(pageIdx),
                                "border border-gray-700 rounded-lg bg-gray-800 ",
                                "hover:bg-gray-700 hover:!text-white",
                                { disabled: pageIdx == currPage },
                            );
                        })
                    }

                    {/* Next page button */}
                    {this.pageButton(
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                            />
                        </svg>,
                        "Next Page",
                        this.makePageQuery(currPage + 1),
                        "rounded-full",
                        "hover:!text-white",
                        { disabled: currPage >= numPages - 1, hide_too: true },
                    )}
                </div>
            </nav>
        );
    }
}
