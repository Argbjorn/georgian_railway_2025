import { BaseRoute } from "./BaseRoute.js"
import stateManager from "../../state/mapStateManager.js"

export class InteractiveRoute extends BaseRoute {
    constructor(map, routeRef) {
        super(map, routeRef)

        stateManager.subscribe((data) => {
            if (data.selectedRoute && data.selectedRoute.ref === this.ref) {
                this.show();
            } else {
                this.hide();
            }
        });
    }
}