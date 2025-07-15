import { routes } from "./routes-list.js";
import stateManager from "./state/mapStateManager.js";

export class Route {
    constructor(map, ref) {
        this.ref = parseInt(ref);
        this.map = map;
        this.routeData = routes.find(route => route.ref === this.ref);
        this.layer = null;

        stateManager.subscribe((data) => {
            if (data.selectedRoute && data.selectedRoute.ref === this.ref) {
                this.show();
            } else {
                this.hide();
            }
        });
    }

    async createLayer() {
        try {
            // Load route geodata from file
            const response = await fetch(`/data/routes_geodata/${this.routeData.id}.json`);
            const routeGeoJSONData = await response.json();
            
            // Create GeoJSON from route data
            const geojson = this.createGeoJSON(routeGeoJSONData);
            
            // Add route layer to map
            this.layer = this.map.addLayer({
                id: `route-${this.ref}`,
                type: 'line',
                source: {
                    type: 'geojson',
                    data: geojson
                },
                paint: {
                    'line-color': '#ff0000',
                    'line-width': 3,
                },
                layout: {
                    'visibility': 'none'
                }
            });
        } catch (error) {
            console.error('Error loading route:', error);
        }
    }

    // Data files are in json format, directly from overpass-turbo, we should convert them to geojson
    createGeoJSON(routeGeoJSONData) {
        const lines = [];
        const wayMembers = routeGeoJSONData.members.filter(member => member.type === 'way');
        wayMembers.forEach(way => {
            if (way.geometry && way.geometry.length > 0) {
                lines.push(way.geometry.map(point => [point.lon, point.lat])); // Original data is in format [lat, lon]
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
        if (this.layer) {
            this.map.setLayoutProperty(`route-${this.ref}`, 'visibility', 'visible');
        }
    }

    hide() {
        if (this.layer) {
            this.map.setLayoutProperty(`route-${this.ref}`, 'visibility', 'none');
        }
    }
}