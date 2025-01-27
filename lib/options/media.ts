import { options } from "./store";
import { MotionPreference } from "./types";

/** List of media to watch */
const WATCHED_MEDIA: { [key: string]: MediaQueryList } = {
    motion: window.matchMedia("(prefers-reduced-motion: reduce)"),
};

/**
 * Subscribes to a media.
 *
 * @param media media to subscribe to
 * @param mediaSetter function that is called on change/setting of the media value
 */
function subscribeToMedia(media: MediaQueryList, mediaSetter: (matches: boolean) => any) {
    // Set initial value
    mediaSetter(media.matches);

    // Watch for changes
    media.addEventListener("change", (event) => mediaSetter(event.matches));
}

subscribeToMedia(WATCHED_MEDIA.motion, (matches) =>
    options.setKey("motion", matches ? MotionPreference.REDUCE : MotionPreference.NORMAL),
);

export default WATCHED_MEDIA;
