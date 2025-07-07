import { RailwayNetwork } from "./RailwayNetwork.js"
import { StationsGroup } from "./StationsGroup.js"

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
    }

    initialize() {
        this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
        this.map.on('load', () => {
            this.onMapLoad();
        })
    }

    onMapLoad() {
        this.railwayNetwork.create();
        this.stationsGroup.create();

    }
}

export default BaseMap