// Tile providers
var atlasTiles = L.tileLayer('https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=6fb239b3c88b4c93b4524271cdbd7e1d', {
    maxZoom: 19,
    attribution: 'Tiles &copy; <a href="https://www.thunderforest.com/" target="_blank">Thunderforest ❤️</a> | Data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
});
var osmTiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
});

import { LanguageService } from './LanguageService.js';

// Tile object for L.control
const tiles = {
    "Standard": osmTiles,
    "Atlas": atlasTiles
};
const overlays = {}

// Initialize map
export const map = L.map('map', {
    center: getDefaultMapCenter(),
    zoom: 8,
    layers: [osmTiles],
    preferCanvas: true,
    zoomControl: false  // Отключаем стандартные кнопки зума
});

// Initialize zoom control
const zoomControl = L.control.zoom({
    position: 'topright'  // Варианты: 'topleft', 'topright', 'bottomleft', 'bottomright'
}).addTo(map);

// Initialize layer control
const layerControl = L.control.layers(tiles, overlays, {
    collapsed: false,
    sortLayers: true,
    position: 'topleft'
}).addTo(map);

// Add title to layer control
setTimeout(() => {
    const layerControlElement = document.querySelector('.leaflet-control-layers');
    if (layerControlElement) {
        const titleDiv = document.createElement('div');
        titleDiv.className = 'leaflet-control-layers-title';
        titleDiv.innerHTML = LanguageService.translate('layer_control_title');
        titleDiv.style.fontWeight = 'bold';
        titleDiv.style.marginBottom = '4px';
        titleDiv.style.fontSize = '14px';
        layerControlElement.prepend(titleDiv);
    }
}, 100);

// Initialize the sidepanel
export const panelRight = L.control.sidepanel('mySidepanel', {
    panelPosition: 'right',
    hasTabs: true,
    tabsPosition: 'top',
    pushControls: true,
    darkMode: false,
    startTab: 'tab-1'
}).addTo(map);

// Returns the default map center
export function getDefaultMapCenter() {
    return [41.721700, 44.799748];
}