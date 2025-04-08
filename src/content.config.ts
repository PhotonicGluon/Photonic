import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

import { projectsLoader } from "@lib/projects/loader";
import { POST_SCHEMA } from "@lib/blog/post";

// Define collections
const projects = defineCollection({
    loader: projectsLoader({ projectsRootPath: "./src/projects" }),
});
const blog = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/blog" }),
    schema: POST_SCHEMA,
});

// Export `collections` object to register collection(s)
export const collections = { projects, blog };
