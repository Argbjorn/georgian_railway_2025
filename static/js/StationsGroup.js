import { Station } from "./Station.js"
import { stations } from "./stations-list.js"

export class StationsGroup {
    constructor(map) {
        this.map = map;
        this.stations = stations.map(station => new Station(this.map, station.coords[0], station.coords[1]));
    }

    create() {
        this.stations.forEach(station => station.create());
    }
}