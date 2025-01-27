import { map } from "nanostores";

import { MotionPreference } from "./types";

export interface Options {
    motion: MotionPreference;
}

export const options = map<Options>({
    motion: MotionPreference.NORMAL,
});
