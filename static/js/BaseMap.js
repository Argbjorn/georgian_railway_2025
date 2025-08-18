import { RailwayNetwork } from "./RailwayNetwork.js"
import { StationsGroup } from "./StationsGroup.js"
import { Sidebar } from "./sidebar.js"
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
    }

    initialize() {
        this.map.addControl(new maplibregl.NavigationControl(), 'top-left');
        this.map.on('load', () => {
            this.onMapLoad();
        })
    }

    onMapLoad() {
        this.railwayNetwork.show();
        this.stationsGroup.show();
    }
}

export default BaseMap