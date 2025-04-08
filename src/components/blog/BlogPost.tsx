import { Component } from "preact";

import type { Post } from "@lib/blog/post";
import { humanizeDate } from "@lib/misc/dates";

interface Props {
    /** Post object to display on the list of posts */
    post: Post;
}

interface State {}

export default class BlogPost extends Component<Props, State> {
    render(props: Props, state: State) {
        const post = props.post;

        return (
            <a href={post.url} class="h-min *:text-white">
                <article class="blog-post flex flex-col border border-gray-700 bg-gray-900 transition-transform duration-300 ease-out hover:scale-[1.05] hover:cursor-pointer">
                    {/* Preamble */}
                    <div class="mx-2 mt-2 md:mx-4 md:mt-4">
                        {/* Publication date */}
                        <span class="font-mono text-sm">{humanizeDate(new Date(post.pubDate))}</span>

                        {/* TODO: Add tags */}
                    </div>

                    {/* Blog cover image */}
                    {/* TODO: Can we use Astro's Image component? */}
                    {post.image && (
                        <img class="mt-2 md:mt-4" src={post.image.url} alt={post.image.alt} loading="eager" />
                    )}

                    {/* Main post content */}
                    <div class="m-2 grid md:m-4 lg:grid-cols-2">
                        {/* Title */}
                        <h1 class="font-mono font-bold md:text-xl lg:text-2xl">{post.title}</h1>

                        {/* Summary */}
                        <p class="!p-0 text-gray-300">{post.summary}</p>
                    </div>
                </article>
            </a>
        );
    }
}
