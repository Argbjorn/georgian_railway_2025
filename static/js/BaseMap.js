import { RailwayNetwork } from "./RailwayNetwork.js"
import { StationsGroup } from "./StationsGroup.js"
import { Sidebar } from "./sidebar.js"
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, GLOBAL_MAP_BOUNDS } from "./constants.js"
import { LanguageService } from "./LanguageService.js"
import { PoiGroup } from "./poiGroup.js"

class BaseMap {
    constructor(container) {
        this.map = new maplibregl.Map({
            container: container,
            style: this.selectTilesByLanguage(),
            center: DEFAULT_MAP_CENTER,
            zoom: DEFAULT_MAP_ZOOM,
            maxBounds: GLOBAL_MAP_BOUNDS
        })
        this.railwayNetwork = new RailwayNetwork(this.map)
        this.stationsGroup = new StationsGroup(this.map)
        this.poiGroup = new PoiGroup(this.map)
        this.sidebar = new Sidebar(this.map, container)
    }

    initialize() {
        this.map.addControl(new maplibregl.NavigationControl(), 'top-left');
        this.map.on('load', () => {
            this.onMapLoad();
        })
    }

    onMapLoad() {
        this.railwayNetwork.show();
        this.stationsGroup.show();
        this.poiGroup.show();
    }

    selectTilesByLanguage() {
        const lang = LanguageService.getCurrentLanguage();
        switch (lang) {
            case 'en':
                return '/map_styles/osm_bright_en_v1.json';
            case 'ru':
                return '/map_styles/osm_bright_ru_v2.json';
            case 'ka':
                return '/map_styles/osm_bright_ka_v1.json';
            default:
                return '/map_styles/osm_bright_en_v1.json';
        }
    }
}

export default BaseMap