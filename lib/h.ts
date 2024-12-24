/**
 * Adapted from https://github.com/s-thom/website-2023/blob/26d8a1a/src/lib/h.ts
 */

/** Regex to match event handler properties (e.g., `onClick`, `onMouseover`, `onClickCapture`) */
const EVENT_NAME_REGEX = /^on(.*)(capture)?$/;

/**
 * Type that helps map attribute names to their values.
 */
type HTMLAttrMap<Tag extends keyof HTMLElementTagNameMap> = Omit<
    HTMLElementTagNameMap[Tag],
    "style"
> & {
    /**
     * Style of the HTML element.
     *
     * Allows partial style properties and custom CSS variables (e.g., `--var: value`)
     */
    style: Partial<Omit<HTMLElementTagNameMap[Tag]["style"], "setProperty">> &
        Record<`--${string}`, string>;
};

/**
 * Creates DOM elements, with type safety.
 *
 * @param tag HTML tag name (e.g., 'div', 'span')
 * @param attributes Element attributes and event handlers
 * @param children Child elements or texts
 * @returns Created HTML element
 */
export function h<Tag extends keyof HTMLElementTagNameMap>(
    tag: Tag,
    attributes: Partial<HTMLAttrMap<Tag>>,
    children: (Node | null | undefined | false | "" | 0)[] | string,
): HTMLElementTagNameMap[Tag] {
    const element = document.createElement(tag);

    // Process each attribute
    for (const [key, value] of Object.entries(attributes)) {
        // Check if attribute is an event handler
        const eventNameMatch = key.match(EVENT_NAME_REGEX);
        if (eventNameMatch) {
            const isCapture = eventNameMatch[2] === "capture";
            // Add event listener with capture phase option
            element.addEventListener(eventNameMatch[1], value as any, {
                capture: isCapture,
            });
            continue;
        }

        // Handle style properties
        if (key === "style") {
            // Set each style property individually
            for (const [prop, propValue] of Object.entries(
                value as CSSStyleDeclaration,
            )) {
                element.style.setProperty(prop, propValue);
            }
            continue;
        }

        // Set regular element properties
        element[key as keyof HTMLElementTagNameMap[Tag]] = value as any;
    }

    // Add children to element
    if (typeof children === "string") {
        element.textContent = children;
    } else {
        for (const child of children) {
            if (!child) {
                continue;
            }
            element.appendChild(child);
        }
    }
    return element;
}
