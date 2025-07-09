import { routes } from "./routes-list.js";
import stateManager from "./state/mapStateManager.js";

export class Route {
    constructor(map, ref) {
        this.ref = parseInt(ref);
        this.map = map;
        this.routeData = routes.find(route => route.ref === this.ref);
        this.layer = null;

        this.create();

        stateManager.subscribe((data) => {
            if (data.selectedRoute && data.selectedRoute.ref === this.ref) {
                this.show();
            } else {
                this.hide();
            }
        });
    }

    async create() {
        try {
            // Загружаем геоданные маршрута из файла
            const response = await fetch(`/data/routes_geodata/${this.routeData.id}.json`);
            const routeGeoJSONData = await response.json();
            
            // Создаем GeoJSON из данных маршрута
            const geojson = this.createGeoJSON(routeGeoJSONData);
            
            // Добавляем слой маршрута на карту
            this.layer = this.map.addLayer({
                id: `route-${this.ref}`,
                type: 'line',
                source: {
                    type: 'geojson',
                    data: geojson
                },
                paint: {
                    'line-color': '#ff0000',
                    'line-width': 3
                }
            });
        } catch (error) {
            console.error('Ошибка при загрузке маршрута:', error);
        }
    }

    createGeoJSON(routeGeoJSONData) {
        const lines = [];
        const wayMembers = routeGeoJSONData.members.filter(member => member.type === 'way');
        wayMembers.forEach(way => {
            if (way.geometry && way.geometry.length > 0) {
                lines.push(way.geometry.map(point => [point.lon, point.lat]));
            }
        });

        return {
            type: 'Feature',
            geometry: {
                type: 'MultiLineString',
                coordinates: lines
            },
            properties: {
                name: routeGeoJSONData.tags?.name || `Маршрут ${this.ref}`
            }
        };
    }

    show() {
        if (!this.layer) {
            this.create();
            return;
        }
        this.map.setLayoutProperty(`route-${this.ref}`, 'visibility', 'visible');
    }

    hide() {
        if (this.layer) {
            this.map.setLayoutProperty(`route-${this.ref}`, 'visibility', 'none');
        }
    }
}