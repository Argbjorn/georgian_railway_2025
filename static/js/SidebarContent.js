export class SidebarContent {
    constructor(entity, type) {
        this.entity = entity;
        this.type = type;
        this.content = document.createElement('div');
    }

    getBody() {
        if (this.type === 'station') {
            this.content.innerHTML = '';
        const viaRoutesHTML = this.entity.routes.via.map((route) => {
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

        if (this.type === 'route') {
            this.content.innerHTML = `
                <div class="sidebar-content">
                    <div class="sidebar-body">
                        <p>Route information</p>
                    </div>
                </div>
            `;
            return this.content;
        }
    }

    getTitle() {
        if (this.type === 'station') {
            return this.entity.name_en;
        }
        if (this.type === 'route') {
            return this.entity.name_en;
        }
    }
}