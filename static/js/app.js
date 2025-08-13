import BaseMap from "./BaseMap.js";
import stateManager from "./state/mapStateManager.js";
import { DeviceTypeDetector } from "./DeviceTypeDetector.js";

const deviceTypeDetector = new DeviceTypeDetector();
stateManager.setDeviceType(deviceTypeDetector.getDeviceType());

const map = new BaseMap('map');
map.initialize();

window.addEventListener('resize', () => {
    const previousDeviceType = stateManager.deviceType;
    const currentDeviceType = deviceTypeDetector.getDeviceType();
    if (previousDeviceType !== currentDeviceType) {
        stateManager.setDeviceType(currentDeviceType);
    }
});