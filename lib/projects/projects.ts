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
    {
        id: "abstract-algebra",
        name: "Abstract Algebra",
        tags: [ProjectTag.Mathematics, ProjectTag.Writing],
        dates: {
            start: new Date("2022-10-04"),
            end: new Date("2024-10-04"),
        },
        banner: "https://raw.githubusercontent.com/PhotonicGluon/Abstract-Algebra-Book/main/images/banner/banner.webp",
        summary: "A series of books about abstract algebra.",
        urls: {
            github: "https://github.com/PhotonicGluon/Abstract-Algebra-Book",
        },
    },
    {
        id: "auditranscribe",
        name: "AudiTranscribe",
        tags: [ProjectTag.Programming, ProjectTag.Music],
        dates: {
            start: new Date("2021-11-14"),
            end: new Date("2023-09-09"),
        },
        banner: "https://raw.githubusercontent.com/AudiTranscribe/AudiTranscribe/main/Designs/banner/banner.webp",
        summary: "An open-source music transcription application..",
        urls: {
            github: "https://github.com/PhotonicGluon/AudiTranscribe",
            website: "https://auditranscribe.app/",
        },
    },
    // TODO: Remove this...
    {
        id: "candid",
        name: "Candid",
        tags: [ProjectTag.Writing],
        dates: {
            start: new Date("2024-08-14"),
            end: new Date("2024-08-31"),
        },
        banner: "/projects/resources/candid/banner.webp", // TODO: Fix path
        summary: "Sealed messages in bottles thrown in the turbulent sea.",
    },
    {
        id: "chess-clock-trivia",
        name: "Chess Clock Trivia",
        tags: [ProjectTag.Programming],
        dates: {
            start: new Date("2021-08-13"),
            end: new Date("2021-09-15"),
        },
        banner: "https://raw.githubusercontent.com/PhotonicGluon/Chess-Clock-Trivia/main/others/Banner.webp",
        summary: "Chess Clock Trivia is a trivia game where teams answer questions within a certain time limit.",
        urls: {
            github: "https://github.com/PhotonicGluon/Chess-Clock-Trivia",
        },
    },
    {
        id: "dreams",
        name: "Dreams",
        tags: [ProjectTag.Music],
        dates: {
            start: new Date("2023-03-18"),
            end: new Date("2023-08-31"),
        },
        banner: "/projects/resources/dreams/cover.webp", // TODO: Fix path
        summary:
            "An album exploring the thoughts that appear in the subconscious and the hidden truths revealed within.",
        urls: {
            bandcamp: "https://melodicgluon.bandcamp.com/album/dreams",
        },
    },
    {
        id: "good-morning-image-finder",
        name: "Good Morning Image Finder",
        tags: [ProjectTag.Programming],
        dates: {
            start: new Date("2021-01-18"),
            end: new Date("2021-01-21"),
        },
        summary: 'A simple application that helps find "Good Morning" images automatically.',
        urls: {
            github: "https://github.com/PhotonicGluon/Good-Morning-Image-Finder",
        },
    },
    {
        id: "intro-to-competitive-programming",
        name: "Intro To Competitive Programming",
        tags: [ProjectTag.Programming, ProjectTag.Writing],
        dates: {
            start: new Date("2022-03-26"),
            end: new Date("2022-04-20"),
        },
        summary: "Jupyter Notebooks for teaching Competitive Programming simply.",
        urls: {
            github: "https://github.com/PhotonicGluon/Intro-To-Competitive-Programming",
        },
    },
    {
        id: "macbeth",
        name: "MACBETh",
        tags: [ProjectTag.Programming],
        dates: {
            start: new Date("2024-04-24"),
            end: new Date("2024-04-30"),
        },
        banner: "https://raw.githubusercontent.com/PhotonicGluon/MACBETh/main/img/banner.png",
        summary:
            "Analyses malware based on its attributes, and helps classify malware based on reports generated in VirusTotal.",
        urls: {
            github: "https://github.com/PhotonicGluon/MACBETh",
        },
    },
    {
        id: "n-gram-lm",
        name: "n-Gram Language Model",
        tags: [ProjectTag.Programming],
        dates: {
            start: new Date("2024-11-28"),
            end: new Date("2024-11-28"),
        },
        summary: "An n-Gram language model created from scratch in Python.",
        urls: {
            github: "https://github.com/PhotonicGluon/n-Gram-Language-Model-From-Scratch",
        },
    },
    // TODO: Mark this as completed once this website is launched
    {
        id: "overwrite",
        name: "Overwrite",
        tags: [ProjectTag.Programming],
        dates: {
            start: new Date("2023-02-01"),
        },
        banner: "/assets/resources/img/banner-dark.webp", // TODO: Fix path/URL
        summary: "PhotonicGluon's portfolio site. Overly obsessive projects by PhotonicGluon.",
        urls: {
            github: "https://github.com/PhotonicGluon/photonicgluon.github.io",
            website: "https://overwrite.site/",
        },
    },
    {
        id: "python-core",
        name: "Python Core",
        tags: [ProjectTag.Programming, ProjectTag.Writing],
        dates: {
            start: new Date("2020-02-03"),
            end: new Date("2020-03-19"),
        },
        summary: "A beginner's python course in the form of Jupyter Notebooks.",
        urls: {
            github: "https://github.com/PhotonicGluon/Python-Core",
        },
    },
    {
        id: "quaestiones",
        name: "Quaestiones",
        tags: [ProjectTag.Programming],
        dates: {
            start: new Date("2020-12-27"),
            end: new Date("2021-06-06"),
        },
        banner: "https://raw.githubusercontent.com/PhotonicGluon/Quaestiones/main/Banner.webp",
        summary: "An application that assists you in making a simple questions asking site.",
        urls: {
            github: "https://github.com/PhotonicGluon/Quaestiones",
        },
    },
    {
        id: "spectra",
        name: "Spectra",
        tags: [ProjectTag.Music],
        dates: {
            start: new Date("2024-01-19"),
            end: new Date("2024-06-28"),
        },
        banner: "/projects/resources/spectra/cover.webp", // TODO: Fix path
        summary: "An album exploring the spectrum of joy that we feel.",
        urls: {
            bandcamp: "https://melodicgluon.bandcamp.com/album/spectra",
        },
    },
    {
        id: "the-challenge",
        name: "The Challenge",
        tags: [ProjectTag.Programming, ProjectTag.Mathematics],
        dates: {
            start: new Date("2020-09-13"),
            end: new Date("2020-11-08"),
        },
        banner: "https://raw.githubusercontent.com/PhotonicGluon/The-Challenge/master/Banner.webp",
        summary: "A web project about solving mathematics problems.",
        urls: {
            github: "https://github.com/PhotonicGluon/The-Challenge",
        },
    },
    {
        id: "video-to-captions",
        name: "Video to Captions",
        tags: [ProjectTag.Programming],
        dates: {
            start: new Date("2021-04-26"),
            end: new Date("2021-10-24"),
        },
        summary: "A program that helps convert a video into a transcript with timestamps.",
        urls: {
            github: "https://github.com/PhotonicGluon/Video-To-Captions",
        },
    },
];
