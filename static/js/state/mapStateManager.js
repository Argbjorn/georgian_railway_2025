import { Station } from "../station.js";

class MapStateManager {
    constructor() {
        this.state = {
            selectedStation: null,
            railwayNetwork: null,
        };

        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }
        }
    }

    emit(data) {
        console.log(data);
        this.listeners.forEach(callback => callback(data));
    }

    clearSelectedStation() {
        this.state = {
            ...this.state,
            selectedStation: null
        }
        this.emit(this.state);
    }

    selectStation(station) {
        try {
            this.state = {
                ...this.state,
                selectedStation: station
            }
            this.emit(this.state);
        } catch (error) {
            console.log(error);
        }
    }

    showBrightRailwayNetwork() {
        this.state = {
            ...this.state,
            railwayNetwork: 'bright'
        }
        this.emit(this.state);
    }
    
    showShadowedRailwayNetwork() {
        this.state = {
            ...this.state,
            railwayNetwork: 'shadowed'
        }
        this.emit(this.state);
    }

    get selectedStation() {
        return this.state.selectedStation;
    }

    get railwayNetwork() {
        return this.state.railwayNetwork;
    }
}

const stateManager = new MapStateManager();
export default stateManager;