import type { Loader } from "astro/loaders";
import { z } from "astro:content";
import { readFileSync, readdirSync } from "fs";

export function projectsLoader(options: { path: string }): Loader {
    // Get projects' folders
    const projectFolders = readdirSync(options.path);

    return {
        name: "photonic-projects-loader",

        // Called when updating the collection.
        load: async ({ store, logger, parseData, meta, generateDigest }): Promise<void> => {
            // TODO: Handle watching and updating of store

            store.clear();

            for (const folder of projectFolders) {
                logger.info(`Loading '${folder}'...`);
                const infoRaw = readFileSync(`${options.path}/${folder}/info.json`, "utf-8");
                const infoJSON = JSON.parse(infoRaw);
                const data = await parseData({
                    id: folder,
                    data: infoJSON,
                });
                const digest = generateDigest(data);
                store.set({
                    id: folder,
                    data,
                    digest,
                });
            }

            logger.info(`Done loading ${projectFolders.length} projects`);
        },
        schema: async () =>
            z.object({
                name: z.string(),
                summary: z.string(),
                dates: z.object({
                    start: z.coerce.date(),
                    end: z.coerce.date().optional(),
                }),
                tags: z.array(z.enum(["mathematics", "music", "programming", "writing"])), // TODO: Use predefined tags
                banner: z.string().optional(),
                urls: z.object({
                    bandcamp: z.string().optional(),
                    github: z.string().optional(),
                    website: z.string().optional(),
                }),
            }),
    };
}
