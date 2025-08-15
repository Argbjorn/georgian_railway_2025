import stateManager from "./state/mapStateManager.js";
import { SidebarContent } from "./SidebarContent.js";
import { Route } from "./route.js";

class Sidebar {
    constructor(map, container) {
        this.map = map;
        this.container = container;
        this.sidebar = null;

        stateManager.subscribe(state => {
            if (state.deviceType === 'mobile') {
                if (state.selectedRoute) {
                    this.show();
                    this.minimize();
                    this.updateContent();
                } else if (state.selectedStation) {
                    this.show();
                    this.maximize();
                    this.updateContent();
                } else {
                    this.close();
                }
            }

            if (state.deviceType === 'desktop') {
                if (state.selectedRoute || state.selectedStation) {
                    this.show();
                    this.updateContent();
                } else {
                    this.close();
                }
            }
            // Update close button visibility
            if (state.deviceType && this.sidebar) {
                this.updateCloseButtonVisibility();
            }
        });
    }

    // Show sidebar
    show() {
        if (!this.sidebar) {
            this.create();
        }
        this.sidebar.classList.add('active');
        this.sidebar.classList.remove('collapsed-auto');
        this.updateSize();
    }

    // Close sidebar
    close() {
        if (this.sidebar) {
            this.sidebar.classList.remove('active', 'collapsed-auto');
        }
    }

    // Minimize sidebar (but not close)
    minimize() {
        if (!this.sidebar) {
            this.create();
        }
        this.sidebar.classList.add('minimized');
    }

    // Maximize sidebar (return to normal size)
    maximize() {
        if (!this.sidebar) {
            this.create();
        }
        this.sidebar.classList.remove('minimized');
    }

    // Update sidebar content
    updateContent() {
        if (!this.sidebar) return;
        let sidebarContent = '';
        if (stateManager.selectedRoute) {
            sidebarContent = new SidebarContent(stateManager.selectedRoute, 'route');
        } else if (stateManager.selectedStation) {
            sidebarContent = new SidebarContent(stateManager.selectedStation, 'station');
        }
        this.sidebar.querySelector('.sidebar-title').innerHTML = sidebarContent.getTitle();
        this.sidebar.querySelector('.sidebar-body').innerHTML = '';
        this.sidebar.querySelector('.sidebar-body').appendChild(sidebarContent.getBody());
    }

    // Create sidebar
    create() {
        this.createDOM();
        this.updateSize();
        this.setupEvents();

        // Update close button visibility based on device type
        this.updateCloseButtonVisibility();
    }
    
    // Обновляем видимость крестика закрытия в зависимости от типа устройства
    updateCloseButtonVisibility() {
        if (!this.sidebar) return;
        
        const closeButton = this.sidebar.querySelector('#sidebar-close-btn');
        if (closeButton) {
            if (stateManager.deviceType === 'mobile') {
                closeButton.style.display = 'flex';
            } else {
                closeButton.style.display = 'none';
            }
        }
    }
    
    // Update sidebar size based on map container
    updateSize() {
        // if (!this.sidebar) return;
        
        // const mapContainer = document.getElementById('map');
        // const mapRect = mapContainer.getBoundingClientRect();
        // const deviceType = stateManager.deviceType;
        
        // if (deviceType === 'mobile') {
        //     // На мобильных устройствах сайдбар занимает половину экрана снизу
        //     this.sidebar.style.top = 'auto';
        //     this.sidebar.style.height = '50vh';
        //     this.sidebar.style.left = '0';
        //     this.sidebar.style.width = '100%';
        // } else {
        //     // На десктопе сайдбар справа
        //     this.sidebar.style.top = mapRect.top + 'px';
        //     this.sidebar.style.height = mapRect.height + 'px';
        //     this.sidebar.style.left = 'auto';
        //     this.sidebar.style.width = '';
        // }
    }  

    // Returns template for sidebar content
    getTemplate() {
        return `
            <div class="sidebar-header">
                <h3 class="sidebar-title"></h3>
                <button class="sidebar-close" id="sidebar-close-btn">x</button>
            </div>
            <div class="sidebar-body"></div>
        `;
    }

    createDOM() {
        this.sidebar = document.createElement('div');
        this.sidebar.id = 'sidebar';
        this.sidebar.className = 'sidebar';
        this.sidebar.innerHTML = this.getTemplate();
        document.body.appendChild(this.sidebar);
    }

    // Setup event listeners
    setupEvents() {
        const sidebarBody = this.sidebar.querySelector('.sidebar-body');
        const closeButton = this.sidebar.querySelector('#sidebar-close-btn');
        
        // Close sidebar handler
        closeButton.addEventListener('click', () => {
            this.close();
            stateManager.clearSelectedStation();
        });
        
        // Route click handler
        sidebarBody.addEventListener('click', async (e) => {
            const routeRef = e.target.getAttribute('data-route-ref');
            if (e.target.classList.contains('route-name')) {
                if (stateManager.createdRoutes.find(route => route.ref === parseInt(routeRef))) {
                    stateManager.selectRoute(stateManager.createdRoutes.find(route => route.ref === parseInt(routeRef)));
                    return;
                }
                const route = new Route(this.map, routeRef);
                stateManager.createRoute(route);
                stateManager.selectRoute(route);
                await route.createLayer();
                route.show();
            }
        });
    }
}

export { Sidebar }