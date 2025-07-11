import stateManager from "./state/mapStateManager.js";
import { SidebarContent } from "./SidebarContent.js";
import { Route } from "./route.js";

class Sidebar {
    constructor(map, container) {
        this.map = map;
        this.container = container;
        this.sidebar = null;
    }

    create() {
        this.sidebar = document.createElement('div');
        this.sidebar.id = 'sidebar';
        this.sidebar.className = 'sidebar';
        this.sidebar.innerHTML = `
            <div class="sidebar-tail">
                <div class="sidebar-handle"></div>
            </div>
            <div class="sidebar-header">
                <button class="sidebar-close">&times;</button>
                <h3 class="sidebar-title">Информация о станции</h3>
            </div>
            <div class="sidebar-content">
                <div class="sidebar-body">
                </div>
            </div>
        `;
        document.body.appendChild(this.sidebar);
        this.updateSidebarSize();

        // Add event listeners
        const tail = this.sidebar.querySelector('.sidebar-tail');
        const closeBtn = this.sidebar.querySelector('.sidebar-close');
        const sidebarBody = this.sidebar.querySelector('.sidebar-body');
        
        tail.addEventListener('click', () => this.toggleSidebar());
        closeBtn.addEventListener('click', () => this.closeSidebar());
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

        stateManager.subscribe(state => {
            if (state.selectedStation) {
                this.showSidebar(state.selectedStation);
            }
        })
        
        stateManager.subscribe(state => {
            if (!state.selectedStation) {
                this.closeSidebar();
            }
        })
    }
    
    // Update sidebar size based on map container
    updateSidebarSize() {
        if (!this.sidebar) return;
        
        const mapContainer = document.getElementById('map');
        const mapRect = mapContainer.getBoundingClientRect();
        
        this.sidebar.style.top = mapRect.top + 'px';
        this.sidebar.style.height = mapRect.height + 'px';
        
        // Update tail position for mobile
        const tail = this.sidebar.querySelector('.sidebar-tail');
        if (tail) {
            tail.style.top = (mapRect.top + mapRect.height / 2) + 'px';
        }
    }
    
    // Sidebar functions
    showSidebar(station) {
        if (!this.sidebar) {
            this.createSidebar();
        }
        
        this.updateSidebarSize();
        
        this.updateSidebarContent(station);
        
        this.sidebar.classList.add('active');
        this.sidebar.classList.remove('collapsed-auto');
    }
    
    updateSidebarContent(station) {
        const sidebarContent = new SidebarContent(station).getContent();
        this.sidebar.querySelector('.sidebar-body').innerHTML = '';
        this.sidebar.querySelector('.sidebar-body').appendChild(sidebarContent);
    }
    
    closeSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.remove('active', 'collapsed-auto');
        }
    }
    
    toggleSidebar() {
        if (this.sidebar && this.sidebar.classList.contains('collapsed-auto')) {
            this.sidebar.classList.remove('collapsed-auto');
            this.sidebar.classList.add('active');
        }
    }
}

export { Sidebar }