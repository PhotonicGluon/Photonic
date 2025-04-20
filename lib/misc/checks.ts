/**
 * Checks if the browser supports the `animation-timeline` CSS property (e.g., in Chrome or Edge).
 *
 * @returns Whether the browser supports the `animation-timeline` CSS property
 */
export function isAnimationTimelineSupported() {
    const el = document.createElement("div");
    el.style.setProperty("animation-timeline", "view()");
    return el.style.getPropertyValue("animation-timeline") === "view()";
}
