export class SidebarContent {
    constructor(station) {
        this.station = station;
        this.content = document.createElement('div');
    }

    getContent() {
        this.content.innerHTML = `
            <div class="sidebar-content">
                <div class="sidebar-body">
                    <p>${this.station.name_en}</p>
                </div>
            </div>
        `;
        const viaRoutesHTML = this.station.routes.via.map((route) => {
            return `
                <div class="route-line">
                    <div class="route-link">
                        <p data-route-ref="${route.ref}" class="route-name">${route.name_en}</p>
                    </div>
                </div>
            `
        }).join('');
        this.content.innerHTML += viaRoutesHTML;

        return this.content;
    }
}