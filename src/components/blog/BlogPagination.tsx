import { Component } from "preact";
import { useStore } from "@nanostores/preact";
import { postStore } from "./store";

import { range } from "@lib/misc/iterables";

interface Props {}

interface State {}

export default class BlogPagination extends Component<Props, State> {
    // Helper methods
    /**
     * Constructs a query string for pagination.
     *
     * @param page The current page index (0-based).
     * @returns A query string with the page number incremented by 1.
     */
    makePageQuery(page: number): string {
        return `?page=${page + 1}`;
    }

    // Component methods
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
    ): preact.JSX.Element {
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

    /**
     * Creates a page number button for pagination.
     *
     * @param pageIdx The index of the page (0-based).
     * @param currPage The index of the currently active page.
     * @returns A page button element with the page number, linking to the respective page.
     */
    pageNumberButton(pageIdx: number, currPage: number): preact.JSX.Element {
        return this.pageButton(
            <span>{(pageIdx + 1).toString()}</span>,
            `Page ${pageIdx + 1}`,
            this.makePageQuery(pageIdx),
            "border border-gray-700 rounded-lg bg-gray-800 ",
            "hover:bg-gray-700 hover:!text-white",
            { disabled: pageIdx == currPage },
        );
    }

    /**
     * Generates a list of pagination buttons for navigating between pages.
     *
     * This method determines which page numbers should be displayed as buttons
     * and includes ellipses for skipped page ranges. It ensures that the first,
     * last, current, and surrounding page numbers are always shown.
     *
     * @param numPages The total number of pages available for pagination.
     * @param currPage The index of the currently active page (0-based).
     * @returns An array of JSX elements representing the pagination buttons.
     */
    standardPageButtons(numPages: number, currPage: number): preact.JSX.Element[] {
        // Determine which page numbers are to be shown
        const pagesIncluded: Set<number> = new Set([
            0,
            currPage > 0 ? currPage - 1 : 2,
            currPage,
            currPage < numPages - 1 ? currPage + 1 : numPages - 3,
            numPages - 1,
        ]);

        // Create page buttons
        const pageButtons: preact.JSX.Element[] = [];
        let ellipsesAdded = false;
        for (let i = 0; i < numPages; i++) {
            if (!pagesIncluded.has(i)) {
                if (!ellipsesAdded) {
                    pageButtons.push(
                        this.pageButton(<span>...</span>, "Ellipses", "No HREF", "text-2xl !bg-black/0", "", {
                            disabled: true,
                        }),
                    );
                    ellipsesAdded = true;
                }
                continue;
            }
            pageButtons.push(this.pageNumberButton(i, currPage));
            ellipsesAdded = false;
        }

        return pageButtons;
    }

    // Lifecycle methods
    render(props: Props, state: State) {
        const $postStore = useStore(postStore);
        const numPages = $postStore.numPages;
        const currPage = $postStore.page;

        return (
            <nav aria-label="Page navigation">
                <div class="inline-flex gap-4 !pb-0 *:gap-4 *:!pb-0 md:gap-2 md:*:gap-2">
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
                        "border rounded-full md:border-0 ",
                        "hover:!text-white",
                        { disabled: currPage < 1, hide_too: true },
                    )}

                    {/* Standard page stuff */}
                    <div class="hidden md:inline-flex">{this.standardPageButtons(numPages, currPage)}</div>
                    <p class="inline-flex flex-wrap content-center md:hidden">
                        Page {currPage + 1} of {numPages}
                    </p>

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
                        "border rounded-full md:border-0",
                        "hover:!text-white",
                        { disabled: currPage >= numPages - 1, hide_too: true },
                    )}
                </div>
            </nav>
        );
    }
}
