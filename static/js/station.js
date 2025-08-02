import stateManager from "./state/mapStateManager.js";

const stationIcons = {
  beach: `<svg class="station-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tree-palm-icon lucide-tree-palm"><path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4"/><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3"/><path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35"/><path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14"/></svg>`,
  main: `<svg class="station-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>`,
  airport: `<svg class="station-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
                </svg>`,
};

export class Station {
  constructor(map, stationData) {
    Object.assign(this, { ...stationData });
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
    const markerEl = document.createElement("div");
    markerEl.className = "station-marker";
    if (this.type in stationIcons) {
      markerEl.className += " station-marker-with-icon";
      markerEl.innerHTML = stationIcons[this.type];
    }
    this.marker = new maplibregl.Marker({ element: markerEl }).setLngLat([
      this.coords[1],
      this.coords[0],
    ]);
    markerEl.addEventListener("click", (e) => {
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
      .setHTML(`<div>${this.name_en}</div>`);
    this.marker.setPopup(popup);

    markerEl.addEventListener("mouseenter", () => {
      popup.addTo(this.map);
    });
    markerEl.addEventListener("mouseleave", () => {
      popup.remove();
    });
  }

  setActive() {
    this.marker.addClassName("active");
  }

  setDefault() {
    this.marker.removeClassName("active");
  }

  hide() {
    this.marker.addClassName("hidden");
  }

  show() {
    this.marker.removeClassName("hidden");
  }
}
