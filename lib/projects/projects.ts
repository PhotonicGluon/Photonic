import { ProjectTag, type Project } from "./structures";

export const projects: Project[] = [
    {
        id: "7125",
        name: "7125",
        tags: [ProjectTag.Music],
        dates: {
            start: new Date("2022-10-16"),
            end: new Date("2023-02-16"),
        },
        banner: "https://f4.bcbits.com/img/a1399793884_10.jpg",
        summary: "An EP exploring themes of secrets, identity, and revelations.",
        urls: {
            bandcamp: "https://melodicgluon.bandcamp.com/album/7125",
        },
    },
];
