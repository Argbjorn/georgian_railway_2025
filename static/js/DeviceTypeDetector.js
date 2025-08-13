export class DeviceTypeDetector {
    constructor() {
        this.deviceType = null;
        this.detectDeviceType();
    }

    detectDeviceType() {
        if (window.innerWidth < 768) {
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