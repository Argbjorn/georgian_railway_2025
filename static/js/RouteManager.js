import { Route } from "./route.js";
import stateManager from "./state/mapStateManager.js";

export class RouteManager {
    constructor(map) {
        this.map = map;
        this.routes = new Map(); // Кэш созданных маршрутов
    }

    // Создает или получает маршрут из кэша
    getRoute(routeRef) {
        if (!this.routes.has(routeRef)) {
            const route = new Route(this.map, routeRef);
            this.routes.set(routeRef, route);
        }
        return this.routes.get(routeRef);
    }

    // Обработчик клика по маршруту
    handleRouteClick(routeRef) {
        const route = this.getRoute(routeRef);
        stateManager.selectRoute(route);
        route.show();
    }

    // Настраивает обработчики событий для элементов маршрутов
    setupRouteEventListeners(container) {
        container.querySelectorAll(".route-line").forEach((element) => {
            const routeLink = element.querySelector(".route-link");
            if (routeLink) {
                routeLink.addEventListener("click", () => {
                    const routeRef = routeLink.getAttribute("data-route-ref");
                    this.handleRouteClick(routeRef);
                });
            }
        });
    }
} 