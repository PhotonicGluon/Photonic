import { Component } from "preact";

import BlogPost from "@components/blog/BlogPost";

import type { Post } from "@lib/blog/post";

interface Props {
    /** List of posts */
    posts: Post[];
}

interface State {}

export default class BlogList extends Component<Props, State> {
    render(props: Props, state: State) {
        const allPosts = props.posts;
        return allPosts.map((post: Post) => <BlogPost post={post} />);
    }
}
