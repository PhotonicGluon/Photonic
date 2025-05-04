/**
 * @param stop stopping value, excluded
 * @returns range of integers from `[0, stop)`.
 */
export function range(stop: number): number[];
/**
 * @param start starting value, included
 * @param stop stopping value, excluded
 * @param step step size. If not provided, defaults to 1
 * @returns range of integers `[start, start + step, start + 2*step, ...]` where the last number is
 *      less than `stop`
 */
export function range(start: number, stop: number, step?: number): number[];
export function range(startOrStop: number, stop?: number, step?: number): number[] {
    // Handle arguments
    let start;
    if (stop === undefined) {
        start = 0;
        stop = startOrStop;
    } else {
        start = startOrStop;
    }

    if (step === undefined) {
        step = 1;
    }

    // Generate range
    let output = [];
    for (let i = start; i < stop; i += step) {
        output.push(i);
    }
    return output;
}

/**
 * Find indices where elements should be inserted to maintain order.
 *
 * Find the index in a sorted array `arr` such that, if `val` were inserted before that index, the
 * order of `arr` would be preserved.
 *
 * @param arr An array of sorted elements.
 * @param val The value to insert into the array.
 * @param comparator A function that compares two elements and returns a negative number if the
 *      first element is less than the second, a positive number if the first is greater, and zero
 *      if they are equal.
 * @returns The index to insert `val` into `arr` such that the order is preserved.
 */

export function searchSorted(arr: number[], val: number, comparator?: (a: number, b: number) => number): number {
    // Handle arguments
    if (comparator === undefined) {
        comparator = (a: number, b: number) => {
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        };
    }

    // Binary search
    let left = 0;
    let right = arr.length - 1;
    let mid = Math.floor((left + right) / 2);
    while (left <= right) {
        if (comparator(arr[mid], val) < 0) {
            left = mid + 1;
        } else if (comparator(arr[mid], val) > 0) {
            right = mid - 1;
        } else {
            return mid;
        }
        mid = Math.floor((left + right) / 2);
    }
    return left;
}
