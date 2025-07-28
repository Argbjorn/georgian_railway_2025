import stateManager from "./state/mapStateManager.js"

export default class RouteModal {
    constructor() {
        this.create();

        stateManager.subscribe((data) => {
            if (data.selectedRoute) {
                this.show(data.selectedRoute);
            } else {
                this.hide();
            }
        });
    }

    create() {
        const mapContainer = document.getElementById('map');
        const modal = document.createElement('div');
        modal.className = 'route-modal';
        modal.innerHTML = `
            <div class="route-modal-content">
                <button class="route-modal-close-btn" title="Close">×</button>
                <h2 class="route-modal-title"></h2>
                <ul class="route-modal-stations"></ul>
                <a class="route-modal-details-link" href="#" target="_blank">Route details</a>
            </div>
        `;
        mapContainer.appendChild(modal);
        this.modal = modal;
        this.titleElem = modal.querySelector('.route-modal-title');
        this.stationsElem = modal.querySelector('.route-modal-stations');
        this.detailsLink = modal.querySelector('.route-modal-details-link');
        this.closeBtn = modal.querySelector('.route-modal-close-btn');
        this.closeBtn.addEventListener('click', () => {
            this.hide();
            stateManager.clearSelectedRoute();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hide();
                stateManager.clearSelectedRoute();
            }
        });
    }

    show(route) {
        this.titleElem.textContent = `Route ${route.ref}`;
        const edgeStations = route.routeData.stations.filter(station => ['start', 'end'].includes(station.role));
        const stationsHTML = edgeStations.map(station => {
            const time = station.departure_time === '-' || station.departure_time === null ? station.arrival_time : station.departure_time;
            return `
                <li class="route-modal-station-row">
                    <span class="route-modal-station-point"></span>
                    <span class="route-modal-station-time">${time}</span>
                    <span class="route-modal-station-name">${station.name_en}</span>
                </li>
            `;
        }).join('');
        this.stationsElem.innerHTML = stationsHTML;
        this.detailsLink.href = `/routes/${route.ref}/`;
        this.modal.classList.add('active');
    }

    hide() {
        this.modal.classList.remove('active');
    }
}