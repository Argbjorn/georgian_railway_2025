import stateManager from "./state/mapStateManager.js"

export default class RouteModal {
    constructor() {
        this.create();
        this.show();
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
                <a class="route-modal-details-link" href="#" target="_blank" rel="noopener">Route details</a>
            </div>
        `;
        mapContainer.appendChild(modal);
        this.modal = modal;
        this.titleElem = modal.querySelector('.route-modal-title');
        this.stationsElem = modal.querySelector('.route-modal-stations');
        this.detailsLink = modal.querySelector('.route-modal-details-link');
        this.closeBtn = modal.querySelector('.route-modal-close-btn');
        this.closeBtn.addEventListener('click', () => this.hide());
        this.detailsLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.routeDetailsUrl) {
                window.open(this.routeDetailsUrl, '_blank');
            }
        });
    }

    show() {
        // Тестовые данные
        const route = {
            id: 801,
            name: '801',
            stations: [
                { name: 'Batumi-Central', time: '16:30', terminal: true },
                { name: 'Tbilisi Central Station', time: '21:55', terminal: true }
            ],
            detailsUrl: 'https://example.com/route-801'
        };
        this.titleElem.textContent = `Route ${route.name || route.id}`;
        this.stationsElem.innerHTML = '';
        (route.stations || []).forEach((station) => {
            const li = document.createElement('li');
            li.className = 'route-modal-station-row';
            const point = document.createElement('span');
            point.className = 'route-modal-station-point' + (station.terminal ? ' terminal' : '');
            li.appendChild(point);
            const time = document.createElement('span');
            time.className = 'route-modal-station-time';
            time.textContent = station.time || '';
            li.appendChild(time);
            const name = document.createElement('span');
            name.className = 'route-modal-station-name';
            name.textContent = station.name;
            li.appendChild(name);
            this.stationsElem.appendChild(li);
        });
        this.routeDetailsUrl = route.detailsUrl || '#';
        this.detailsLink.style.display = route.detailsUrl ? 'inline-block' : 'none';
        this.modal.classList.add('active');
    }

    hide() {
        this.modal.classList.remove('active');
    }
}