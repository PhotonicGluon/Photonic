import type { DevToolbarApp } from "astro";
import { defineToolbarApp } from "astro/toolbar";

const motivationalMessages = [
    "You're doing great!",
    "Keep up the good work!",
    "You're awesome!",
    "You're a star!",
];

const tweakpaneDevTools: DevToolbarApp = {
    init(canvas, app) {
        const h1 = document.createElement("h1");
        h1.textContent =
            motivationalMessages[
                Math.floor(Math.random() * motivationalMessages.length)
            ];

        canvas.append(h1);

        // Display a random message when the app is toggled
        app.onToggled(({ state }) => {
            const newMessage =
                motivationalMessages[
                    Math.floor(Math.random() * motivationalMessages.length)
                ];
            h1.textContent = newMessage;
        });
    },
};

export default tweakpaneDevTools;
