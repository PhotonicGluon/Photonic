/**
 * Adapted from https://github.com/s-thom/website-2023/blob/26d8a1a/src/integrations/slidersDevTools.ts
 */
import {
    type SlidersInitialisedEventData,
    addExportSettingsButton,
    addImportSettingsButton,
    addOptionsToPanel,
} from "../panel";
import { tweakpaneCSS } from "./css";
import { h } from "@lib/misc/h";
import { type DevToolbarApp } from "astro";
import { Pane } from "tweakpane";

const tweakpaneDevTools: DevToolbarApp = {
    init(canvas, app) {
        const container = h(
            "astro-dev-overlay-window" as any,
            { style: { padding: "0px", borderRadius: "7px" } },
            [h("style", {}, tweakpaneCSS), h("style", {}, `:host {z-index: 9999;}`)],
        );
        canvas.appendChild(container);

        let pane: Pane;

        app.onToggled(({ state }) => {
            if (state) {
                pane = new Pane({ container, title: "Tweakpane" });

                const event = new CustomEvent<SlidersInitialisedEventData>("sliders-initialised", {
                    detail: {
                        registerSliders(id: string, options) {
                            const folder = pane.addFolder({ title: id });
                            addOptionsToPanel(folder, options);
                            addImportSettingsButton(folder);
                            addExportSettingsButton(folder);
                        },
                    },
                });
                window.dispatchEvent(event);
            } else {
                if (pane) {
                    pane.dispose();
                }
            }
        });
    },
};

export default tweakpaneDevTools;
