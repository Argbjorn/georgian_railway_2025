class MapStateManager {
    constructor() {
        this.state = {
            selectedStation: null
        };

        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    unsubscribe() {
        
    }

    emit(data) {
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
                selectedStation: this._validateStation(station)
            }
            this.emit(this.state);
        } catch (error) {
            console.log(error);
        }
    }

    _validateStation(station) {
        if (typeof station != "string" || station.length == 0) {
            throw new Error("Incorrect station code");
        }
        return station;
    }

    get selectedStation() {
        return this.state.selectedStation;
    }
}

const stateManager = new MapStateManager();
export default stateManager;