const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

/**
 * Converts the month index to a string.
 *
 * @param month The month index.
 * @returns Month string.
 */
export function strMonth(month: number): string {
    if (month < 0 || month >= 12) throw Error(`Invalid month index ${month}`);
    return MONTHS[month];
}

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

/**
 * Converts a Date object to the APA7 date format (e.g., "2025, March 14").
 *
 * @param date The Date object to format.
 * @param yearFirst Whether the year should come first in the date or not.
 * @returns A string representing the date in the APA7 citation format.
 */
export function citationDate(date: Date, yearFirst: boolean = true): string {
    const day = date.getDate();
    const month = strMonth(date.getMonth());
    const year = date.getFullYear();

    if (yearFirst) {
        return `${year}, ${month} ${day}`;
    }
    return `${month} ${day}, ${year}`;
}
