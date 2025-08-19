import { RailwayNetwork } from "./RailwayNetwork.js"
import { StationsGroup } from "./StationsGroup.js"
import { Sidebar } from "./sidebar.js"
import { MAPTILER_API_KEY, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "./constants.js"
import { LanguageService } from "./languageService.js"

class BaseMap {
    constructor(container) {
        this.map = new maplibregl.Map({
            container: container,
            style: this.selectTilesByLanguage(),
            center: DEFAULT_MAP_CENTER,
            zoom: DEFAULT_MAP_ZOOM
        })
        this.railwayNetwork = new RailwayNetwork(this.map)
        this.stationsGroup = new StationsGroup(this.map)
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