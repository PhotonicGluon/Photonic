import { defineCollection } from "astro:content";
import { projectsLoader } from "@lib/projects/loader";

// Define collections
const projects = defineCollection({
    loader: projectsLoader({ path: "./projects" }),
});

// Export `collections` object to register collection(s)
export const collections = { projects };
