import { railwayNetworkData } from "./railway-network-data.js"
import stateManager from "./state/mapStateManager.js"

export class RailwayNetwork {
    constructor(map) {
        this.map = map;
        this.brightPaint = {
            'line-color': '#32373B',
            'line-width': 3
        }
        this.shadowPaint = {
            'line-color': '#808080',
            'line-width': 3
        }

        stateManager.subscribe((data) => {
            if (data.selectedRoute) {
                this.showShadow();
            } else {
                this.showBright();
            }
        });
    }

    show() {
        if (this.map.getSource('railwayNetwork')) {
            return
        }
        this.map.addSource('railwayNetwork', { type: 'geojson', data: railwayNetworkData });
        this.map.addLayer({
                  id: 'railwayNetwork',
                  type: 'line',
                  source: 'railwayNetwork',
                  paint: this.brightPaint
              });
    }

    showBright() {
        const currentPaint = this.map.getPaintProperty('railwayNetwork', 'line-color');
        if (currentPaint == this.brightPaint["line-color"]) {
            return
        }
        this.map.setPaintProperty('railwayNetwork', 'line-color', this.brightPaint["line-color"])
    }

    showShadow() {
        const currentPaint = this.map.getPaintProperty('railwayNetwork', 'line-color');
        if (currentPaint == this.shadowPaint["line-color"]) {
            return
        }
        this.map.setPaintProperty('railwayNetwork', 'line-color', this.shadowPaint["line-color"])
    }
}