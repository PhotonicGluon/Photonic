import type { Loader, LoaderContext } from "astro/loaders";
import { readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import generateSchema from "./schema";

/**
 * Options for the project loader.
 */
interface ProjectLoaderOptions {
    /** Path to the projects' directory */
    projectsRootPath: string;
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

        const projectInfo = JSON.parse(readFileSync(`${options.projectsRootPath}/${id}/info.json`, "utf-8"));
        const data = await context.parseData({
            id: id,
            data: projectInfo,
        });
        context.store.set({
            id: id,
            data: data,
            digest: context.generateDigest(data),
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
