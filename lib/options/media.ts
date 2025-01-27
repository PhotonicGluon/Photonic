import { options } from "./store";
import { MotionPreference } from "./types";

function reducedMotionSetter(matches: boolean) {
    options.setKey("motion", matches ? MotionPreference.REDUCE : MotionPreference.NORMAL);
}

function subscribeToMedia(query: string, mediaSetter: (matches: boolean) => any) {
    // Get the match media
    const match = window.matchMedia(query);

    // Set initial value
    mediaSetter(match.matches);

    // Watch for changes
    match.addEventListener("change", (event) => mediaSetter(event.matches));
}

subscribeToMedia("(prefers-reduced-motion: reduce)", reducedMotionSetter);
