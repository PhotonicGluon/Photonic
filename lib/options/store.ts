import { map } from "nanostores";

export enum PrefersReducedMotion {
    NORMAL = 0,
    REDUCE = 1,
}

export interface Options {
    motion: PrefersReducedMotion;
}

export const options = map<Options>({
    motion: PrefersReducedMotion.NORMAL,
});
