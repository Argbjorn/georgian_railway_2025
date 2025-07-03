// Sidebar module
let sidebar = null;
let currentPopup = null;

// Create sidebar
function createSidebar() {
    sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
        <div class="sidebar-tail" onclick="toggleSidebar()">
            <div class="sidebar-handle"></div>
        </div>
        <div class="sidebar-header">
            <button class="sidebar-close" onclick="closeSidebar()">&times;</button>
            <h3 class="sidebar-title">Информация о станции</h3>
        </div>
        <div class="sidebar-content">
            <div class="sidebar-body">
                <p>Содержимое панели</p>
                <a href="#" class="test-route-link" onclick="showTestRoute()">
                    Показать маршрут Тбилиси-Батуми
                </a>
            </div>
        </div>
    `;
    document.body.appendChild(sidebar);
    updateSidebarSize();
}

// Update sidebar size based on map container
function updateSidebarSize() {
    if (!sidebar) return;
    
    const mapContainer = document.getElementById('map');
    const mapRect = mapContainer.getBoundingClientRect();
    
    sidebar.style.top = mapRect.top + 'px';
    sidebar.style.height = mapRect.height + 'px';
    
    // Update tail position for mobile
    const tail = sidebar.querySelector('.sidebar-tail');
    if (tail) {
        tail.style.top = (mapRect.top + mapRect.height / 2) + 'px';
    }
}

// Show test route
function showTestRoute() {
    // Get map instance from global scope
    const map = window.mapInstance;
    if (!map) return;
    
    // Remove existing route if exists
    if (window.testRoute) {
        try {
            map.removeLayer('test-route');
            map.removeSource('test-route');
        } catch (e) {
            // Layer/source might not exist
        }
        window.testRoute = null;
    }
    
    const routeData = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [
                [44.79624, 41.73289], // Тбилиси
                [41.67732, 41.65829]  // Батуми
            ]
        }
    };
    
    map.addSource('test-route', {
        type: 'geojson',
        data: routeData
    });
    
    map.addLayer({
        id: 'test-route',
        type: 'line',
        source: 'test-route',
        paint: {
            'line-color': '#ff0000',
            'line-width': 1
        }
    });
    
    window.testRoute = true;
    
    // On mobile, auto-collapse sidebar after showing route
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
        sidebar.classList.add('collapsed-auto');
    }
}

// Sidebar functions
function showSidebar(stationName) {
    if (!sidebar) createSidebar();
    
    updateSidebarSize();
    
    const titleElement = sidebar.querySelector('.sidebar-title');
    titleElement.textContent = stationName;
    
    sidebar.classList.add('active');
    sidebar.classList.remove('collapsed-auto');
}

function closeSidebar() {
    if (sidebar) {
        sidebar.classList.remove('active', 'collapsed-auto');
    }
}

function toggleSidebar() {
    if (sidebar && sidebar.classList.contains('collapsed-auto')) {
        sidebar.classList.remove('collapsed-auto');
        sidebar.classList.add('active');
    }
}

// Handle station click
function handleStationClick(stationName) {
    // Close any existing popup
    if (currentPopup) {
        currentPopup.remove();
        currentPopup = null;
    }
    
    // Show sidebar
    showSidebar(stationName);
}

// Handle map click (desktop only)
function handleMapClick() {
    if (window.innerWidth > 768) {
        closeSidebar();
    }
}

// Make functions global
window.showTestRoute = showTestRoute;
window.closeSidebar = closeSidebar;
window.toggleSidebar = toggleSidebar;
window.handleStationClick = handleStationClick;
window.handleMapClick = handleMapClick;

// Update sidebar size on window resize
window.addEventListener('resize', updateSidebarSize);

// Export functions for module usage
export { showSidebar, closeSidebar, toggleSidebar, handleStationClick, handleMapClick }; 