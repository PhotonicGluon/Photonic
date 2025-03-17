import { Component } from "preact";
import { useStore } from "@nanostores/preact";
import { postStore } from "./store";

import BlogPost from "@components/blog/BlogPost";

import type { Post } from "@lib/blog/post";

interface Props {
    /** List of all posts */
    allPosts: Post[];
}

interface State {}

export default class BlogList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        // Set displayed posts to be initial
        postStore.setKey("displayed", props.allPosts.slice(0, postStore.get().numPerPage));
    }

    render(props: Props, state: State) {
        const $projectStore = useStore(postStore);
        const displayedPosts = $projectStore.displayed;
        return displayedPosts.map((post: Post) => <BlogPost post={post} />);
    }
}
