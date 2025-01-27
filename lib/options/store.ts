import { map } from "nanostores";

import { PrefersReducedMotion } from "./types";

export interface Options {
    motion: PrefersReducedMotion;
}

export const options = map<Options>({
    motion: PrefersReducedMotion.NORMAL,
});
