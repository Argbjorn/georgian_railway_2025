// This class is responsible for mass showing/hiding stations

import { Station } from "./station.js"
import { stations } from "./stations-list.js"
import stateManager from "./state/mapStateManager.js"

export class StationsGroup {
    constructor(map) {
        this.map = map;
        this.stations = stations.map(stationData => new Station(this.map, stationData));

        stateManager.subscribe((data) => {
            if (data.selectedRoute) {
                this.showOnlyRouteStations(data.selectedRoute.routeData);
            } else {
                this.show();
            }
        });
    }

    show() {
        this.stations.forEach(station => station.show());
    }

    hide() {
        this.stations.forEach(station => station.hide());
    }

    showOnlyRouteStations(route) {
        const routeStations = route.stations.map(station => station.code);
        this.stations.forEach(station => {
            if (routeStations.includes(station.code)) {
                station.show();
            } else {
                station.hide();
            }
        });
    }
}