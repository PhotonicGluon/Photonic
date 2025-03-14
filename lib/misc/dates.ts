/**
 * Converts a Date object to a string in the format "YYYY-MM-DD".
 *
 * @param date The Date object to format.
 * @returns A string representing the date in "YYYY-MM-DD" format.
 */

export function toDateString(date: Date): string {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * Converts a Date object to a string like "14 March 2025".
 *
 * @param date The Date object to format.
 * @returns A string representing the date in a human format.
 */
export function humanizeDate(date: Date): string {
    const dateFormat = new Intl.DateTimeFormat("en-UK", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return dateFormat.format(date);
}
