import stateManager from "./state/mapStateManager.js"

export class Station {
    constructor(map, stationData) {
        Object.assign(this, { ...stationData })
        this.map = map;
        this.marker = null;
        
        this.createMarker();

        stateManager.subscribe((data) => {
            if (data.selectedStation === this) {
                this.setActive();
            } else {
                this.setDefault();
            }
        });

    }

    createMarker() {
        const markerEl = document.createElement('div');
        markerEl.className = 'station-marker';
        markerEl.style.width = '18px';
        markerEl.style.height = '18px';
        markerEl.style.borderRadius = '50%';
        markerEl.style.border = '2px solid #C8102E';
        markerEl.style.background = '#fff';
        markerEl.style.boxSizing = 'border-box';
        markerEl.style.cursor = 'pointer';

        this.marker = new maplibregl.Marker({ element: markerEl })
            .setLngLat([this.coords[1], this.coords[0]]);
    }

    create() {
        this.marker.addTo(this.map);

        const markerElement = this.marker.getElement();
        markerElement.addEventListener('click', (e) => {
            e.stopPropagation();
            stateManager.selectStation(this);
        });
    }

    setActive() {
        this.marker.getElement().style.background = '#C8102E';
        this.marker.getElement().style.border = '2px solid #fff';
    }

    setDefault() {
        this.marker.getElement().style.background = '#fff';
        this.marker.getElement().style.border = '2px solid #C8102E';
    }
}