export class BaseStationsGroup {
    constructor(map) {
        this.map = map;
        this.stations = [];
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