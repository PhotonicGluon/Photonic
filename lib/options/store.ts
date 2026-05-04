import { MotionPreference } from "./types";
import { map } from "nanostores";

export interface Options {
    motion: MotionPreference;
}

export const options = map<Options>({
    motion: MotionPreference.NORMAL,
});
