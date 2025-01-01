/**
 * Represents an RGBA colour.
 */
export interface Colour {
    /** Red component (0-255) */
    r: number;
    /** Green component (0-255) */
    g: number;
    /** Blue component (0-255) */
    b: number;
    /** Optional alpha component (0-255) */
    a?: number;
}

/**
 * Parses a given hex string and returns its corresponding RGBA colour.
 *
 * @param hex The hex string to parse.
 * @param alpha Overriding alpha value. If not specified, will use the alpha of the colour. If the
 *     colour does not specify an alpha, will use 255 (fully opaque).
 * @throws {Error} If the given hex string is not a valid hex colour.
 * @returns The parsed RGBA colour.
 */
export function hexToRGBA(hex: string, alpha: number | null = null): Colour {
    // Try parsing the given hex string
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
    if (!result) {
        throw Error(`${hex} is not a valid hex colour`);
    }

    // Define colour
    let colour: Colour = {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: parseInt(result[4] ? result[4] : "ff", 16),
    };

    // Override the alpha if specified
    if (alpha !== null) {
        colour.a = alpha;
    }

    return colour;
}

/**
 * Formats the given RGBA object into a string.
 *
 * @param colour The colour to format.
 * @returns A string representing the given colour in RGBA format.
 */
export function formatRGBA(colour: Colour): string {
    return `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`;
}
