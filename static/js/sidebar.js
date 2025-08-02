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
            <div class="sidebar-content">
                <div class="sidebar-body">
                    Hello, world
                </div>
            </div>
        `;
        document.body.appendChild(this.sidebar);
        this.updateSize();

        // Add event listeners
        const sidebarBody = this.sidebar.querySelector('.sidebar-body');
        
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
                this.show(state.selectedStation);
            }
        })
    }
    
    // Update sidebar size based on map container
    updateSize() {
        if (!this.sidebar) return;
        
        const mapContainer = document.getElementById('map');
        const mapRect = mapContainer.getBoundingClientRect();
        
        this.sidebar.style.top = mapRect.top + 'px';
        this.sidebar.style.height = mapRect.height + 'px';
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
    
    // Close sidebar
    close() {
        if (this.sidebar) {
            this.sidebar.classList.remove('active', 'collapsed-auto');
        }
    }
}

export { Sidebar }