import { Poi, poiInfo } from "./poi.js"
import { LanguageService } from "./LanguageService.js"

export class PoiGroup {
    constructor(map) {
        this.map = map;
        this.pois = poiInfo.map(poi => new Poi(this.map, poi[`description_${LanguageService.getCurrentLanguage()}`], poi.coords))
    }

    show() {
        this.pois.forEach(poi => poi.show())
    }

    hide() {
        this.pois.forEach(poi => poi.hide())
    }
}