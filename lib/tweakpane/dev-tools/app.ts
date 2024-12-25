/**
 * Adapted from https://github.com/s-thom/website-2023/blob/26d8a1a/src/integrations/slidersDevTools.ts
 */

import { type DevToolbarApp } from "astro";
import { Pane } from "tweakpane";
import { h } from "../../h";
import { addOptionsToPanel, type SlidersInitialisedEventData } from "../../shaders/tweakpane";
import { tweakpaneCSS } from "./css";

const tweakpaneDevTools: DevToolbarApp = {
    init(canvas, app) {
        const container = h("astro-dev-overlay-window" as any, { style: { padding: "0px", borderRadius: "7px" } }, [
            h("style", {}, tweakpaneCSS),
        ]);
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
