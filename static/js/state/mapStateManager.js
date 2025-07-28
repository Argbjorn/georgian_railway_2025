class MapStateManager {
    constructor() {
        this.state = {
            railwayNetwork: 'bright',
            selectedStation: null,
            selectedRoute: null,
            selectedRouteStations: null,
            createdRoutes: []
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

    selectRoute(route) {
        this.state = {
            ...this.state,
            selectedRoute: route
        }
        this.emit(this.state);
    }

    clearSelectedRoute() {
        this.state = {
            ...this.state,
            selectedRoute: null
        }
        this.emit(this.state);
    }

    createRoute(route) {
        this.state = {
            ...this.state,
            createdRoutes: [...this.state.createdRoutes, route]
        }
        this.emit(this.state);
    }

    get selectedStation() {
        return this.state.selectedStation;
    }

    get railwayNetwork() {
        return this.state.railwayNetwork;
    }

    get selectedRoute() {
        return this.state.selectedRoute;
    }

    get createdRoutes() {
        return this.state.createdRoutes;
    }
}

const stateManager = new MapStateManager();
export default stateManager;