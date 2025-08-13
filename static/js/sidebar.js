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
                if (state.selectedStation) {
                    this.show(state.selectedStation);
                    if (state.selectedRoute) {
                        this.minimize();
                    } else {
                        this.maximize();
                    }
                } else {
                    this.close();
                }
            }
            if (state.deviceType === 'desktop') {
                if (state.selectedStation) {
                    this.show(state.selectedStation);
                } else {
                    this.close();
                }
            }
            // Обновляем видимость крестика при изменении типа устройства
            if (state.deviceType && this.sidebar) {
                this.updateCloseButtonVisibility(state.deviceType);
            }
        })
    }

    create() {
        console.log('start creating a sidebar');
        this.sidebar = document.createElement('div');
        this.sidebar.id = 'sidebar';
        this.sidebar.className = 'sidebar';
        this.sidebar.innerHTML = `
            <div class="sidebar-header">
                <h3 class="sidebar-title"></h3>
                <button class="sidebar-close" id="sidebar-close-btn">×</button>
            </div>
            <div class="sidebar-content">
                <div class="sidebar-body">
                    <p></p>
                </div>
            </div>
        `;
        document.body.appendChild(this.sidebar);
        this.updateSize();

        // Обновляем видимость крестика в зависимости от типа устройства
        this.updateCloseButtonVisibility(stateManager.deviceType);

        // Add event listeners
        const sidebarBody = this.sidebar.querySelector('.sidebar-body');
        const closeButton = this.sidebar.querySelector('#sidebar-close-btn');
        
        // Обработчик для закрытия сайдбара
        closeButton.addEventListener('click', () => {
            this.close();
            stateManager.clearSelectedStation();
        });
        
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
    
    // Обновляем видимость крестика закрытия в зависимости от типа устройства
    updateCloseButtonVisibility(deviceType) {
        if (!this.sidebar) return;
        
        const closeButton = this.sidebar.querySelector('#sidebar-close-btn');
        if (closeButton) {
            if (deviceType === 'mobile') {
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
    
    // Show sidebar
    show(station) {
        if (!this.sidebar) {
            this.create();
        }
        
        this.updateSize();
        this.sidebar.classList.add('active');
        this.sidebar.classList.remove('collapsed-auto');

        if (station) {
            this.updateTitle(station.name_en);
            this.updateContent(station);
        }
    }
    
    // Update sidebar content
    updateContent(station) {
        if (!station) {
            this.sidebar.querySelector('.sidebar-body').innerHTML = 'Hello, world';
            return;
        }
        
        const sidebarContent = new SidebarContent(station).getContent();
        this.sidebar.querySelector('.sidebar-body').innerHTML = '';
        this.sidebar.querySelector('.sidebar-body').appendChild(sidebarContent);
    }

    updateTitle(title) {
        this.sidebar.querySelector('.sidebar-title').innerHTML = title;
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
}

export { Sidebar }