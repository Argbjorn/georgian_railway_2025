import { railwayNetworkData } from "./railway-network-data.js";
import { stations } from "./stations-list.js";
import { handleStationClick, handleMapClick } from "./sidebar.js";

let map;

map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=KxWbLysHDIRHxmljrz4c',
    center: [44.799748, 41.721700],
    zoom: 8
});

// Make map available globally for sidebar
window.mapInstance = map;
window.testRoute = null;

map.addControl(new maplibregl.NavigationControl(), 'top-right');

map.on('load', () => {
    // Railway network
    map.addSource('railway', { type: 'geojson', data: railwayNetworkData });
    map.addLayer({
        id: 'railway',
        type: 'line',
        source: 'railway',
        paint: {
            'line-color': '#000000',
            'line-width': 2
        }
    });

    // Stations
    const stationsGeoJSON = {
        type: 'FeatureCollection',
        features: stations.map(station => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [station.coords[1], station.coords[0]]
            },
            properties: {
                id: station.id,
                code: station.code,
                type: station.type,
                name_en: station.name_en,
                name_ka: station.name_ka,
                name_ru: station.name_ru
            }
        }))
    };

    map.addSource('stations', { type: 'geojson', data: stationsGeoJSON });
    map.addLayer({
        id: 'stations',
        type: 'circle',
        source: 'stations',
        paint: {
            'circle-color': '#FF0000',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#FFFFFF'
        }
    });

    // Station click handler
    map.on('click', 'stations', (e) => {
        const stationName = e.features[0].properties.name_ru;
        handleStationClick(stationName);
        e.stopPropagation();
    });

    // Close sidebar when clicking on empty map (desktop only)
    map.on('click', (e) => {
        handleMapClick();
    });

    // Change cursor to pointer when hovering over stations
    map.on('mouseenter', 'stations', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'stations', () => {
        map.getCanvas().style.cursor = '';
    });
});