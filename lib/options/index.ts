import { options, PrefersReducedMotion, type Options } from "./store";

// Helper functions to get options
function getMotionPreference(): PrefersReducedMotion {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches === true;
    return isReduced ? PrefersReducedMotion.REDUCE : PrefersReducedMotion.NORMAL;
}

// Set up store
function getOptions(): Options {
    return {
        motion: getMotionPreference(),
    };
}

// Set and get options state
options.set(getOptions());
const $options = options.get();

export default $options;
