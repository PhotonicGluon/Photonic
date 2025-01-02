/**
 * Converts a given string to title case, where the first letter of each word is capitalized and the
 * rest are in lowercase.
 *
 * @param str The input string to be converted to title case.
 * @returns The input string in title case format.
 */
export function toTitleCase(str: string): string {
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
