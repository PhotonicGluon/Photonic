import type { Post } from "@lib/blog/post";
import { deepMap, type BaseDeepMap } from "nanostores";

// TODO: Add
// const tagsList = Object.values(ProjectTag);
// export const tagNames = tagsList.map((tag) => tag.name);

export interface PostStoreValue extends BaseDeepMap {
    // /** Current search query */
    // search: string;
    // /** Set of tags that should be shown */
    // tags: Set<string>;
    // /** Parameters for the sorting */
    // sort: SortParameters;

    /** All posts */
    posts: Post[];
    /** Number of pages */
    numPages: number;
    /** Page index */
    page: number;
    /** Number of posts to show per page*/
    numPerPage: number;
}

export const postStore = deepMap<PostStoreValue>({
    // search: "",
    // tags: new Set(tagNames),
    // sort: { date: SortDate.END, order: SortOrder.REVERSED },

    posts: [],
    numPages: 1, // Will be updated during pagination count
    page: 0,
    numPerPage: 10,
});
