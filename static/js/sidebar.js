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
        });
    }

    // Show sidebar
    show() {
        if (!this.sidebar) {
            this.create();
        }
        this.sidebar.classList.add('active');
        this.sidebar.classList.remove('collapsed-auto');
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
        this.setupEvents();
    }

    // Returns template for sidebar content
    getTemplate() {
        return `
            <div class="sidebar-header">
                <h3 class="sidebar-title"></h3>
                <button class="sidebar-close" id="sidebar-close-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
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
            stateManager.clearSelectedRouteAndStation();
        });
        
        // Route click handler
        sidebarBody.addEventListener('click', async (e) => {
            // Handle back to train list button
            if (e.target.getAttribute('data-action') === 'back-to-train-list') {
                stateManager.clearSelectedRoute();
                return;
            }
            
            // Find the route-link element (could be the clicked element or a parent)
            const routeLink = e.target.closest('.route-link');
            if (routeLink) {
                const routeRef = routeLink.getAttribute('data-route-ref');
                if (routeRef) {
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
            }
        });
    }
}

export { Sidebar }