import { RailwayNetwork } from "./RailwayNetwork.js"
import { StationsGroup } from "./StationsGroup.js"
import { Sidebar } from "./sidebar.js"
import RouteModal from "./RouteModal.js"
import stateManager from "./state/mapStateManager.js"

class BaseMap {
    constructor(container) {
        this.map = new maplibregl.Map({
            container: container,
            style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=KxWbLysHDIRHxmljrz4c',
            center: [44.799748, 41.721700],
            zoom: 7
        })
        this.railwayNetwork = new RailwayNetwork(this.map)
        this.stationsGroup = new StationsGroup(this.map)
        this.sidebar = new Sidebar(this.map, container)
        this.routeModal = new RouteModal()
    }

    initialize() {
        this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
        this.map.on('load', () => {
            this.onMapLoad();
        })
        // Click on an empty space on a map clears selected station and route
        this.map.on('click', (e) => {
            // Check only custom layers
            const features = this.map.queryRenderedFeatures(e.point, {
                layers: ['railwayNetwork']
            });
            if (features.length === 0) {
                stateManager.clearSelectedStation();
                stateManager.clearSelectedRoute();
            }
        })
    }

    onMapLoad() {
        this.railwayNetwork.show();
        this.stationsGroup.show();
        this.sidebar.show();
        this.routeModal.show();
    }
}

export default BaseMap