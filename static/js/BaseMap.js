import { RailwayNetwork } from "./RailwayNetwork.js"
import { StationsGroup } from "./StationsGroup.js"
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
    }

    initialize() {
        this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
        this.map.on('load', () => {
            this.onMapLoad();
        })
        this.map.on('click', (e) => {
            // Проверяем только наши кастомные слои
            const features = this.map.queryRenderedFeatures(e.point, {
                layers: ['railwayNetwork']
            });
            if (features.length === 0) {
                stateManager.clearSelectedStation();
            }
        })
    }

    onMapLoad() {
        this.railwayNetwork.create();
        this.stationsGroup.create();

    }
}

export default BaseMap