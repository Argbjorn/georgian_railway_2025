import { Station } from "./station.js"
import { stations } from "./stations-list.js"
import stateManager from "./state/mapStateManager.js"

export class StationsGroup {
    constructor(map) {
        this.map = map;
        this.stations = stations.map(stationData => new Station(this.map, stationData));

        stateManager.subscribe((data) => {
            if (data.selectedRoute) {
                this.hide();
            } else {
                this.show();
            }
        });
    }

    create() {
        this.stations.forEach(station => station.create());
    }

    show() {
        this.stations.forEach(station => station.show());
    }

    hide() {
        this.stations.forEach(station => station.hide());
    }
}