import { routes } from "./routes-list.js";

export class Route {
    constructor(map, ref) {
        this.ref = parseInt(ref);
        this.map = map;
        this.routeData = routes.find(route => route.ref === this.ref);
    }

    async create() {
        try {
            // Загружаем геоданные маршрута из файла
            const response = await fetch(`/data/routes_geodata/${this.routeData.id}.json`);
            const routeData = await response.json();
            
            // Создаем GeoJSON из данных маршрута
            const geojson = this.createGeoJSON(routeData);
            
            // Добавляем слой маршрута на карту
            this.map.addLayer({
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

    createGeoJSON(routeData) {
        const coordinates = [];
        
        // Извлекаем координаты из ways (путей)
        routeData.members.forEach(member => {
            if (member.type === 'way' && member.geometry) {
                member.geometry.forEach(point => {
                    coordinates.push([point.lon, point.lat]);
                });
            }
        });

        return {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: coordinates
            },
            properties: {
                name: routeData.tags?.name || `Маршрут ${this.ref}`
            }
        };
    }
}