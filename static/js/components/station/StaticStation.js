import { BaseStation } from "./BaseStation.js"
import { ANIMATION_DURATION } from "../../constants.js";

export class StaticStation extends BaseStation {
    constructor(map, stationData) {
        super(map, stationData)
    }

    flyToMarker() {
        this.map.easeTo({
          center: [this.coords[1], this.coords[0]],
          duration: ANIMATION_DURATION
        });
      }
}