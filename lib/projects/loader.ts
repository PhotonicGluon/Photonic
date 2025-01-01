import type { Loader, LoaderContext } from "astro/loaders";
import { readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import generateSchema from "./schema";
import path from "path";

/**
 * Options for the project loader.
 */
interface ProjectLoaderOptions {
    /** Path to the projects' directory */
    projectsRootPath: string;
}
/**
 * Given a file path, this async function returns the HTML content of the file.
 *
 * @param file - The path to the file to be converted to HTML.
 * @returns The HTML content of the file.
 * @throws {Error} If the file type is unsupported.
 */
async function generateHTMLOfFile(file: string): Promise<string> {
    const extension = path.extname(file);
    if (extension == ".html") {
        return readFileSync(file, "utf-8");
    }
    if (extension == ".md") {
        const fileContent = await import(/* @vite-ignore */ path.resolve(file));
        return fileContent.compiledContent();
    }

    // TODO: Handle ".astro" files?

    throw Error(`Unsupported file type: ${extension}`);
}

/**
 * Synchronizes the specified projects by loading their data from the file system and updating the store.
 *
 * @param projectIDs - An array of project IDs to be synchronized.
 * @param options - Contains options for the project loader.
 * @param context - The loader context.
 * @param log - A boolean indicating whether to log the loading process; defaults to `true`.
 */

async function syncProjects(
    projectIDs: string[],
    options: ProjectLoaderOptions,
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
        let indexPageContent;
        if (data.indexPage) {
            const indexPagePath = `${options.projectsRootPath}/${id}/${data.indexPage}`;
            indexPageContent = await generateHTMLOfFile(indexPagePath);
        } else {
            indexPageContent = "No index page";
        }

        // Compute digest
        const digest = context.generateDigest({
            data: data,
            html: indexPageContent,
        });

        // Set the store
        context.store.set({
            id: id,
            data: data,
            digest: digest,
            rendered: {
                html: indexPageContent,
            },
        });
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
            const projectIDs = readdirSync(projectsRootPathAbsolute); // Directory names *are* the IDs
            await syncProjects(projectIDs, options, context);

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
                // context.store.delete(changedProjectID);
                await syncProjects([changedProjectID], options, context, false);
                context.logger.info(`Updated '${changedProjectID}'`);
            });
        },
        schema: async () => await generateSchema(),
    };
}
