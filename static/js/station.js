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
        this.marker = new maplibregl.Marker({ element: markerEl })
            .setLngLat([this.coords[1], this.coords[0]]);
        markerEl.addEventListener('click', (e) => {
            e.stopPropagation();
            stateManager.selectStation(this);
        });
        this.marker.addTo(this.map);
        const popup = new maplibregl.Popup({
            offset: 10,
            closeButton: false,
            closeOnClick: false,
            closeOnEscape: false,
        })
        .setLngLat([this.coords[1], this.coords[0]])
        .setHTML(`<div>${this.name_en}</div>`)
        this.marker.setPopup(popup);

        markerEl.addEventListener('mouseenter', () => {
            popup.addTo(this.map);
        });
        markerEl.addEventListener('mouseleave', () => {
            popup.remove();
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

    hide() {
        this.marker.addClassName('hidden');
    }

    show() {
        this.marker.removeClassName('hidden');
    }
}