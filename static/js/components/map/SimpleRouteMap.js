import { StaticStationsGroup } from "../stations-group/StaticStationsGroup.js"
import { StaticRoute } from "../route/StaticRoute.js"
import { routes } from "../route/routes-list.js"
import { BaseMap } from "./BaseMap.js"

class SimpleRouteMap extends BaseMap {
    constructor(container, routeRef) {
        super(container)
        this.stationsGroup = new StaticStationsGroup(this.map)
        this.routeRef = routeRef
        this.routeData = this.getRouteData(this.routeRef)
    }

    async onMapLoad() {
        const route = new StaticRoute(this.map, this.routeRef);
        await route.createLayer();
        route.show();
        this.stationsGroup.showOnlyRouteStations(this.routeData);
    }

    getRouteData(routeRef) {
        return routes.find(route => route.ref === parseInt(routeRef))
    }
}

export default SimpleRouteMap