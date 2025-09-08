import { BaseMap } from "./BaseMap.js"

class SimpleStationMap extends BaseMap {
    constructor(container, stationCoords) {
        super(container)
        this.stationCoords = [stationCoords[1], stationCoords[0]]
    }

    async onMapLoad() {
        this.createMarker();
        this.setCenter(this.stationCoords);
        this.setZoom(14);
    }

    createMarker() {
        const markerEl = document.createElement("div");
        markerEl.className = "station-marker";
        this.marker = new maplibregl.Marker({ element: markerEl }).setLngLat([
          this.stationCoords[0],
          this.stationCoords[1],
        ]);
        this.marker.addTo(this.map);
      }

    setCenter(center) {
        this.map.setCenter(center);
    }

    setZoom(zoom) {
        this.map.setZoom(zoom);
    }
}

export default SimpleStationMap