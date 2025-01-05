import { ButtonApi, type BladeApi, type FolderApi, type Pane } from "tweakpane";
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
            case "vec4":
                const vec4Container = {
                    vec4: {
                        x: option.value[0],
                        y: option.value[1],
                        z: option.value[2],
                        w: option.value[3],
                    },
                };
                pane.addBinding(vec4Container, "vec4", {
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
                    },
                    z: {
                        min: option.min ?? -100,
                        max: option.max ?? 100,
                        step: option.step ?? 0.01,
                    },
                    w: {
                        min: option.min ?? -100,
                        max: option.max ?? 100,
                        step: option.step ?? 0.01,
                    },
                }).on("change", (ev) => {
                    option.value = [ev.value.x, ev.value.y, ev.value.z, ev.value.w];
                });
                break;
            default:
                throw new Error(`Unsupported option type for ${key}`);
        }
    }
}

/**
 * Adds a button to the pane that, when clicked, prints the raw state of the pane as well as the
 * values of all the options to the console.
 *
 * @param pane The pane to add the button to.
 */
export function addExportSettingsButton(pane: Pane | FolderApi) {
    const btn = pane.addButton({
        title: "Export Settings",
    });
    btn.on("click", () => {
        const rawState = pane.exportState();
        console.log(`*** Raw state ***\n${JSON.stringify(rawState, null, 2)}`);

        const paneChildren = rawState.children as BladeApi[];

        // Get the values of each of the options
        let valuesOutputString = "";
        for (const child of paneChildren) {
            // Skip the export settings button
            try {
                let childButton = child as ButtonApi;
                if (childButton.title === "Export Settings") {
                    continue;
                }
            } catch (e) {}
            // @ts-ignore
            valuesOutputString += `${child.label}: ${JSON.stringify(child.binding.value, null, 2)}\n`;
        }

        console.log(`*** Values ***\n${valuesOutputString}`);

        alert("See console for output");
    });
}
