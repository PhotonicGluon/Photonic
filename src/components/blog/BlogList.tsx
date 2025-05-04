import { Component } from "preact";
import { useStore } from "@nanostores/preact";
import { postStore } from "./store";

import BlogPost from "@components/blog/BlogPost";

import type { Post } from "@lib/blog/post";

interface Props {
    /** List of all posts */
    allPosts: Post[];
    /** Number of pages */
    numPages: number;
    /** Maximum number of posts to show per page */
    numPerPage: number;
}

interface State {}

export default class BlogList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        postStore.setKey("posts", props.allPosts);
        postStore.setKey("numPages", props.numPages);
        postStore.setKey("numPerPage", props.numPerPage);
    }

    render(props: Props, state: State) {
        const $postStore = useStore(postStore);
        const displayedPosts = $postStore.posts.slice(
            $postStore.page * $postStore.numPerPage,
            ($postStore.page + 1) * $postStore.numPerPage,
        );
        return displayedPosts.map((post: Post) => <BlogPost post={post} />);
    }
}
