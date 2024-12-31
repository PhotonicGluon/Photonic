export interface Colour {
    r: number;
    g: number;
    b: number;
    a?: number;
}

/**
 * Converts a given hex colour to an RGBA object.
 *
 * The colour is assumed to be in the format "#RRGGBB" or "#RRGGBBAA", where the octothorpe is
 * optional.
 *
 * @param hex The hex colour to convert.
 * @returns The RGBA object equivalent to the given hex colour.
 *
 * @throws {Error} If the given hex colour is not a valid hex colour.
 */
export function hexToRGBA(hex: string): Colour {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
    if (!result) throw Error(`${hex} is not a valid hex colour`);

    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: parseInt(result[4] ? result[4] : "ff", 16),
    };
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
