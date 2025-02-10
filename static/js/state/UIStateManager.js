class UIStateManager {
    constructor() {
        this.panelState = {
            isOpen: false,
            content: '',
        };

        this.mapState = {
            activeRoute: null,
            previousActiveRoute: null,
            activeStation: null,
            previousActiveStation: null,
        };

        this.listeners = {
            panel: [],
            map: [],
        };

        this.isMobile = window.innerWidth < 768;

        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
        });
    }
    subscribe(stateKey, callback) {
        this.listeners[stateKey].push(callback);
    }

    notifyListeners(stateKey) {
        this.listeners[stateKey].forEach(callback => {
            callback(this[`${stateKey}State`]);
        });
    }

    updatePanelState(newState) {
        this.panelState = {
            ...this.panelState,
            ...newState,
        };
        this.notifyListeners('panel');
    }

    updateMapState(newState) {
        this.mapState = {
            ...this.mapState,
            previousActiveStation: this.mapState.activeStation,
            ...newState,
        };
        this.notifyListeners('map');
    }

    closePanel() {
        this.updatePanelState({ isOpen: false });
    }

    openPanel(content) {
        this.updatePanelState({ isOpen: true, content });
    }

    log(place) {
        console.log('===' + place + '===');
        console.table(this.mapState);
        console.table(this.panelState);
    }
}

export default new UIStateManager();
