import type { FolderApi, Pane } from "tweakpane";
import type { SlidersOptionsMap } from "./options";

// Slider event
/**
 * Event data for the `sliders-initialised` event.
 */
export interface SlidersInitialisedEventData {
    /** Function that is called to register sliders */
    registerSliders(id: string, options: SlidersOptionsMap): void;
}

/**
 * Custom event for the `sliders-initialised` event.
 */
export const SlidersInitialisedEvent = CustomEvent<SlidersInitialisedEventData>;

// Functions
/**
 * Adds a new option to the panel.
 *
 * @param pane Panel or folder to add the option to
 * @param options Option to add to the panel
 */
export function addOptionsToPanel(pane: Pane | FolderApi, options: SlidersOptionsMap) {
    for (const [key, option] of Object.entries(options)) {
        switch (option.type) {
            case "button":
                pane.addButton({ title: option.label ?? key }).on("click", option.onClick);
                break;
            case "boolean":
            case "string":
                pane.addBinding(option, "value", {
                    label: key,
                    readonly: option.readonly,
                });
                break;
            case "float":
                pane.addBinding(option, "value", {
                    label: key,
                    readonly: option.readonly,
                    min: option.min ?? 0,
                    max: option.max ?? 100,
                    step: option.step ?? 1,
                });
                break;
            case "int":
                pane.addBinding(option, "value", {
                    label: key,
                    readonly: option.readonly,
                    min: option.min ?? 0,
                    max: option.max ?? 100,
                    step: 1,
                });
                break;
            case "rgb":
                const rgbContainer = {
                    rgb: {
                        r: option.value[0],
                        g: option.value[1],
                        b: option.value[2],
                    },
                };
                pane.addBinding(rgbContainer, "rgb", {
                    label: key,
                    readonly: option.readonly,
                    picker: "inline",
                    color: { type: "float" },
                }).on("change", (ev) => {
                    option.value = [ev.value.r, ev.value.g, ev.value.b];
                });
                break;
            case "rgba":
                const rgbaContainer = {
                    rgba: {
                        r: option.value[0],
                        g: option.value[1],
                        b: option.value[2],
                        a: option.value[3],
                    },
                };
                pane.addBinding(rgbaContainer, "rgba", {
                    label: key,
                    readonly: option.readonly,
                    picker: "inline",
                    color: { type: "float" },
                }).on("change", (ev) => {
                    option.value = [ev.value.r, ev.value.g, ev.value.b, ev.value.a];
                });
                break;
            case "vec2":
                const vec2Container = {
                    vec2: {
                        x: option.value[0],
                        y: option.value[1],
                    },
                };
                pane.addBinding(vec2Container, "vec2", {
                    label: key,
                    readonly: option.readonly ?? (false as any),
                    picker: "inline",
                    x: {
                        min: option.min ?? -100,
                        max: option.max ?? 100,
                        step: option.step ?? 0.01,
                    },
                    y: {
                        min: option.min ?? -100,
                        max: option.max ?? 100,
                        step: option.step ?? 0.01,
                        inverted: option.invertY,
                    },
                }).on("change", (ev) => {
                    option.value = [ev.value.x, ev.value.y];
                });
                break;
            default:
                throw new Error(`Unsupported option type for ${key}`);
        }
    }
}
