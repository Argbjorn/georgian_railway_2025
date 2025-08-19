import { DESKTOP_THRESHOLD } from "../constants.js";

export class DeviceTypeDetector {
    constructor() {
        this.deviceType = null;
        this.detectDeviceType();
    }

    detectDeviceType() {
        if (window.innerWidth < DESKTOP_THRESHOLD) {
            this.deviceType = 'mobile';
        } else {
            this.deviceType = 'desktop';
        }
    }

    getDeviceType() {
        this.detectDeviceType();
        return this.deviceType;
    }
}