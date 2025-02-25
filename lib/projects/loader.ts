import type { Loader, LoaderContext } from "astro/loaders";
import {
    createMarkdownProcessor,
    parseFrontmatter,
    type MarkdownHeading,
    type MarkdownProcessor,
} from "@astrojs/markdown-remark";
import { readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { PROJECT_SCHEMA } from "./project";

// Copied from astro's `data-store.ts` file
//     https://github.com/withastro/astro/blob/a6a4a66/packages/astro/src/content/data-store.ts#L4
interface RenderedContent {
    /** Rendered HTML string. If present then `render(entry)` will return a component that renders this HTML. */
    html: string;
    metadata?: {
        /** Any images that are present in this entry. Relative to the {@link DataEntry} filePath. */
        imagePaths?: Array<string>;
        /** Any headings that are present in this file. */
        headings?: MarkdownHeading[];
        /** Raw frontmatter, parsed parsed from the file. This may include data from remark plugins. */
        frontmatter?: Record<string, any>;
        /** Any other metadata that is present in this file. */
        [key: string]: unknown;
    };
}

/**
 * Options for the project loader.
 */
interface ProjectLoaderOptions {
    /** Path to the projects' directory */
    projectsRootPath: string;
}

/**
 * Given a file path to a markdown file, this async function generates the rendered component.
 *
 * @param file Path to the markdown file.
 * @param processor Markdown processor.
 * @returns Rendered component of the markdown file.
 * @throws {Error} If the file type is unsupported.
 */
// Thanks to https://github.com/withastro/docs/issues/9543#issuecomment-2525573308
async function renderMarkdown(file: string, processor: MarkdownProcessor): Promise<RenderedContent> {
    // Read the file
    const extension = path.extname(file);
    if (extension !== ".md") {
        throw Error(`Unsupported file type: ${extension}`);
    }

    const text = readFileSync(file, "utf-8");

    // Parse markdown
    const parsedFrontmatter = parseFrontmatter(text);
    const frontmatter = parsedFrontmatter.frontmatter;
    const rendered = await processor.render(parsedFrontmatter.content ?? "");

    // Return the content
    return {
        html: rendered.code,
        metadata: {
            headings: rendered.metadata.headings,
            frontmatter: frontmatter,
        },
    };
}

/**
 * Synchronizes the specified projects by loading their data from the file system and updating the store.
 *
 * @param projectIDs - An array of project IDs to be synchronized.
 * @param options - Contains options for the project loader.
 * @param processor Markdown processor.
 * @param context - The loader context.
 * @param log - A boolean indicating whether to log the loading process.
 */

async function syncProjects(
    projectIDs: string[],
    options: ProjectLoaderOptions,
    processor: MarkdownProcessor,
    context: LoaderContext,
    log: boolean = true,
) {
    for (const id of projectIDs) {
        if (log) {
            context.logger.info(`Loading '${id}'...`);
        }

        // Get the info of the project
        const projectInfo = JSON.parse(readFileSync(`${options.projectsRootPath}/${id}/info.json`, "utf-8"));
        const data = await context.parseData({
            id: id,
            data: projectInfo,
        });

        // Get index page of the project
        let content: RenderedContent | null;
        if (data.indexPage !== undefined) {
            const indexPagePath = `${options.projectsRootPath}/${id}/${data.indexPage}`;
            content = await renderMarkdown(indexPagePath, processor);
        } else {
            content = null;
        }

        // Compute digest
        const digest = context.generateDigest({
            data: data,
            html: content?.html,
            metadata: content?.metadata,
        });

        // Set the store
        const mainStoreData = { id: id, data: data, digest: digest };
        if (content !== null) {
            context.store.set({
                ...mainStoreData,
                rendered: content,
            });
        } else {
            context.store.set(mainStoreData);
        }
    }

    if (log) {
        context.logger.info(`Done loading ${projectIDs.length} projects`);
    }
}

/**
 * Creates a loader for managing project data and synchronizing it with the store.
 *
 * @param options - Configuration options for the project loader.
 * @returns A Loader object with methods to load and watch project data.
 */

export function projectsLoader(options: ProjectLoaderOptions): Loader {
    return {
        name: "photonic-projects-loader",

        // Called when updating the collection.
        load: async (context: LoaderContext): Promise<void> => {
            // Generate absolute file path
            const url = new URL(options.projectsRootPath, context.config.root);
            const projectsRootPathAbsolute = fileURLToPath(url);

            // Clear the store for us to add new projects to
            context.store.clear();

            // Sync all projects
            const processor = await createMarkdownProcessor(context.config.markdown); // Do this to reuse Shiki instance

            const projectIDs = readdirSync(projectsRootPathAbsolute); // Directory names *are* the IDs
            if (projectIDs.includes(".DS_Store")) {
                projectIDs.splice(projectIDs.indexOf(".DS_Store"), 1);
            }

            await syncProjects(projectIDs, options, processor, context);

            // Watch for project file changes
            context.watcher?.on("change", async (changedPath: string) => {
                // Ignore non-project file changes
                if (!changedPath.includes(projectsRootPathAbsolute)) {
                    return;
                }

                // Get the project whose content was changed
                let changedPathRelative = changedPath.replace(projectsRootPathAbsolute + "/", "");
                let changedProjectID = changedPathRelative.split("/")[0];

                // Resync
                await syncProjects([changedProjectID], options, processor, context, false);
                context.logger.info(`Updated '${changedProjectID}'`);
            });
        },
        schema: async () => PROJECT_SCHEMA,
    };
}
