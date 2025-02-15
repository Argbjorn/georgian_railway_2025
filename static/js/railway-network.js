import { getOverpassData } from "./main-test.js";
import { map } from "./map.js";
import { LanguageService as LS } from "./LanguageService.js";
import { railwayNetworkData } from "./railway-network-data.js";



export class RailwayNetwork {
    constructor(mapContainer) {
        this.mapContainer = mapContainer;
        
        map.createPane('railwayPane');
        map.getPane('railwayPane').style.zIndex = 300;
        
        this.renderer = L.canvas({ pane: 'railwayPane', padding: 1 });
        
        this.polylineOptions = {
            stroke: true,
            color: '#32373B',
            weight: 3,
            renderer: this.renderer
        };
        this.polylineOptionsShadowed = {
            stroke: true,
            color: '#5D6E6F',
            weight: 3,
            renderer: this.renderer
        };
        this.layerGroup = this.create();
        this.isShadowed = true;
    }

    create() {
        this.showLoader();
        let network = L.featureGroup();
        // const query = `[out:json][timeout:25];
        //         ( area[name="საქართველო"]; )->.searchArea;
        //         nwr["railway"="rail"]["usage"!="industrial"]["service"!="spur"]["service"!="yard"]["service"!="siding"](area.searchArea);
        //         out geom;`
        // getOverpassData(query)
        const data = railwayNetworkData['elements'];
        data.forEach(element => {
            const polyline = L.polyline(element.geometry, this.polylineOptions);
            network.addLayer(polyline);
        });
        this.hideLoader();
        return network;
    }

    show() {
        this.layerGroup.setStyle(this.polylineOptions)
        this.layerGroup.addTo(map);
        // map.setView(getDefaultMapCenter(), 8)
    }

    hide() {
        this.layerGroup.remove();
    }

    shadow() {
        this.layerGroup.setStyle(this.polylineOptionsShadowed)
    }

    // changeStyle() {
    //     if (this.isShadowed) {
    //         this.layerGroup.setStyle(this.polylineOptions);
    //     } else {
    //         this.layerGroup.setStyle(this.polylineOptionsShadowed);
    //     }
    //     this.isShadowed = !this.isShadowed;
    // }

    showLoader() {
        let loader = document.createElement('div');
        loader.classList.add('railway-network-loader');
        loader.innerHTML = `<div class="loading-text">${LS.translate('loading_railway_network')}</div>`
        this.mapContainer.appendChild(loader);
    }

    hideLoader() {
        const loader = document.querySelector('.railway-network-loader');
        if (loader) {
            loader.remove();
        }
    }
}