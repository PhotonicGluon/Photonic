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
