import { Station } from "./station.js"
import { stations } from "./stations-list.js"

export class StationsGroup {
    constructor(map) {
        this.map = map;
        this.stations = stations.map(stationData => new Station(this.map, stationData));
    }

    create() {
        this.stations.forEach(station => station.create());
    }
}