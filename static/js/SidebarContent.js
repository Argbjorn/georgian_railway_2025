import { LanguageService } from "./LanguageService.js";

export class SidebarContent {
    constructor(entity, type) {
        this.entity = entity;
        this.type = type;
        this.content = document.createElement('div');
        this.currentLanguage = LanguageService.getCurrentLanguage();
    }

    getTitle() {
        if (this.type === 'station') {
            return this.entity[`name_${this.currentLanguage}`];
        }
        if (this.type === 'route') {
            return this.entity[`name_${this.currentLanguage}`];
        }
    }

    getBody() {
        if (this.type === 'station') {
            this.content.innerHTML = '';
            
            // Group routes by categories
            const routeGroups = [
                {
                    key: 'departure',
                    titleKey: 'departures',
                    routes: this.entity.routes.departure || []
                },
                {
                    key: 'arrival', 
                    titleKey: 'arrivals',
                    routes: this.entity.routes.arrival || []
                },
                {
                    key: 'via',
                    titleKey: 'passes_through', 
                    routes: this.entity.routes.via || []
                }
            ];

            // Generate HTML for each group
            routeGroups.forEach(group => {
                if (group.routes.length > 0) {
                    const groupHTML = this.renderRouteGroup(group);
                    this.content.innerHTML += groupHTML;
                }
            });

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

    renderRouteGroup(group) {
        const groupTitle = LanguageService.translate(group.titleKey);
        
        // Sort routes by time
        const sortedRoutes = [...group.routes].sort((a, b) => {
            const timeA = this.getTimeInfo(a, group.key);
            const timeB = this.getTimeInfo(b, group.key);
            
            // If one of the routes has no time, place it at the end
            if (!timeA && !timeB) return 0;
            if (!timeA) return 1;
            if (!timeB) return -1;
            
            // Compare time in HH:MM format
            return timeA.localeCompare(timeB);
        });
        
        const routesHTML = sortedRoutes.map(route => {
            const routeName = route[`name_${this.currentLanguage}`] || route.name_en;
            const timeInfo = this.getTimeInfo(route, group.key);
            
            return `
                <div class="route-line">
                    <div class="route-link" data-route-ref="${route.ref}">
                        <div class="route-header">
                            ${timeInfo ? `<span class="route-time">${timeInfo}</span>` : ''}
                            <div class="route-name">
                                <span class="route-label">${route.ref}</span>
                                <span class="route-destination">${routeName}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="route-group">
                <h4 class="route-group-title">${groupTitle}</h4>
                <div class="route-group-content">
                    ${routesHTML}
                </div>
            </div>
        `;
    }

    getTimeInfo(route, groupType) {
        switch (groupType) {
            case 'departure':
                return route.departure_time && route.departure_time !== '-' ? route.departure_time : null;
            case 'arrival':
                return route.arrival_time && route.arrival_time !== '-' ? route.arrival_time : route.departure_time;
            case 'via':
                return route.arrival_time && route.arrival_time !== '-' ? route.arrival_time : route.departure_time;
            default:
                return null;
        }
    }
}