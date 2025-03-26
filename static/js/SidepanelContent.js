import { getRoutesByStation, getRouteTimeByStation, getRoutePoints, getStationNameByCode, toggleRoute } from "./main-test.js";
import { LanguageService as LS } from "./LanguageService.js";
import UIStateManager from "./state/UIStateManager.js";

export class SidepanelContent {
  constructor(station) {
    this.station = station;
    this.container = document.querySelector(".sidepanel-routes-content");
  }

  async render() {
    let content = await this.createContent();
    this.container.innerHTML = "";
    this.container.appendChild(content);
    this.setupEventListeners();
  }

  renderDefaultGreeting() {
    this.container.innerHTML = LS.translate('default_greeting');
  }

  clear() {
    this.container.innerHTML = "";
  }


  async createContent() {
    let parentContainer = document.createElement("div");
    parentContainer.innerHTML = "";

    let stationHeader = document.createElement("h2");
    let stationBody = document.createElement("div");
    let stationDescription = document.createElement("p");
    let stationArrivals = document.createElement("div");
    let stationDepartures = document.createElement("div");
    let stationPassesThrough = document.createElement("div");

    parentContainer.appendChild(stationHeader);
    parentContainer.appendChild(stationBody);
    stationBody.appendChild(stationDescription);
    stationBody.appendChild(stationDepartures);
    stationBody.appendChild(stationArrivals);
    stationBody.appendChild(stationPassesThrough);

    parentContainer.classList.add("station");
    stationBody.classList.add("station-body");
    stationHeader.classList.add("station-header");
    stationDescription.classList.add("station-description");
    stationDepartures.classList.add("station-routes-list");
    stationArrivals.classList.add("station-routes-list");
    stationPassesThrough.classList.add("station-routes-list");
    parentContainer.setAttribute("id", this.station.code);


    stationHeader.innerHTML = this.station.name;

    // Добавляем ссылку на страницу станции
    let stationLink = document.createElement("a");
    let stationLinkBase = '/stations/';
    if (LS.getCurrentLanguage() == "ru") {
        stationLinkBase = '/ru/stations/';
    }
    if (LS.getCurrentLanguage() == "ka") {
      stationLinkBase = '/ka/stations/';
    }
    stationLink.href = `${stationLinkBase}${this.station.code}/`;
    stationLink.innerHTML = LS.translate("view_station_details");
    stationLink.classList.add("station-more-info");
    stationLink.setAttribute("target", "_blank");
    
    stationBody.insertBefore(stationLink, stationDescription);

    if (this.station.description) {
      stationDescription.innerHTML = this.station.description;
    } else {
      stationDescription.innerHTML = "";
    }

    stationArrivals.innerHTML = `<h3>${LS.translate("arrivals")}</h3>`;
    stationDepartures.innerHTML = `<h3>${LS.translate("departures")}</h3>`;
    stationPassesThrough.innerHTML = `<h3>${LS.translate(
      "passes_through"
    )}</h3>`;

    let stationRoutes = getRoutesByStation(this.station.code);

    if (stationRoutes.length > 0) {
      let arrivals = [];
      let departures = [];
      let passesThrough = [];
      stationRoutes.forEach((route) => {
        let routeLine;
        let routePoints = getRoutePoints(route);
        if (this.station.code == routePoints[0]) {
          routeLine = this.makeRouteLine(route, this.station.code, "departure");
          departures.push(routeLine);
        } else if (this.station.code == routePoints[1]) {
          routeLine = this.makeRouteLine(route, this.station.code, "arrival");
          arrivals.push(routeLine);
        } else if (routePoints[2].includes(this.station.code)) {
          routeLine = this.makeRouteLine(route, this.station.code, "through");
          passesThrough.push(routeLine);
        }
      });
      if (arrivals.length == 0) {
        stationArrivals.classList.add("hidden");
      }
      if (departures.length == 0) {
        stationDepartures.classList.add("hidden");
      }
      if (passesThrough.length == 0) {
        stationPassesThrough.classList.add("hidden");
      }
      let arrivalsSorted = arrivals.sort((a, b) => (a.time > b.time ? 1 : -1));
      let departuresSorted = departures.sort((a, b) =>
        a.time > b.time ? 1 : -1
      );
      let passesThroughSorted = passesThrough.sort((a, b) =>
        a.time > b.time ? 1 : -1
      );
      arrivalsSorted.forEach((a) => {
        stationArrivals.appendChild(a.html);
      });
      departuresSorted.forEach((a) => {
        stationDepartures.appendChild(a.html);
      });
      passesThroughSorted.forEach((a) => {
        stationPassesThrough.appendChild(a.html);
      });
    } else {
      stationDepartures.innerHTML += `<p>${LS.translate(
        "no_schedule_yet"
      )}</p>`;
      stationArrivals.innerHTML += `<p>${LS.translate("no_schedule_yet")}</p>`;
      stationPassesThrough.classList.add("hidden");
    }
    return parentContainer;
  }

  makeRouteLine(route, stationCode, direction) {
    let routeLine = document.createElement("div");
    let routeHeader = document.createElement("div");
    let routeLink = document.createElement("a");
    let routeTime = document.createElement("div");
    let routeLabel = document.createElement("span");
    let routeDestination = document.createElement("span");
    let routeName = document.createElement("div");
    let routeShow = document.createElement("button");
    let routeMoreInfo = document.createElement("a");

    routeLine.appendChild(routeHeader);
    routeHeader.appendChild(routeTime);
    routeHeader.appendChild(routeName);
    routeHeader.appendChild(routeLink);
    routeLink.appendChild(routeLabel);
    routeLink.appendChild(routeDestination);
    routeLine.appendChild(routeShow);
    routeLine.appendChild(routeMoreInfo);

    routeLine.classList.add("route-line");
    routeHeader.classList.add("route-header");
    routeTime.classList.add("route-time");
    routeName.classList.add("route-name");
    routeLink.classList.add("route-link");
    routeLabel.classList.add("route-label");
    routeDestination.classList.add("route-destination");
    routeShow.classList.add("route-show");
    routeMoreInfo.classList.add("route-more-info");

    routeLink.setAttribute("id", route.id);
    
    let time = getRouteTimeByStation(route, stationCode);
    routeTime.innerHTML = time + " ";
    routeLabel.innerHTML = route.ref;

    let destination;

    if (direction == "departure") {
      destination = getStationNameByCode(getRoutePoints(route)[1]);
    } else if (direction == "arrival") {
      destination = getStationNameByCode(getRoutePoints(route)[0]);
    } else if (direction == "through") {
      destination =
        getStationNameByCode(getRoutePoints(route)[0]) +
        " " +
        "→" +
        " " +
        getStationNameByCode(getRoutePoints(route)[1]);
    }

    routeDestination.innerHTML = destination;

    if (UIStateManager.isMobile) {
      routeShow.innerHTML = LS.translate("show_on_map");
      routeShow.style.cursor = "pointer";
    }

    let routeLinkBase = '/routes/';
    if (LS.getCurrentLanguage() == "ru") {
        routeLinkBase = '/ru/routes/';
    }
    if (LS.getCurrentLanguage() == "ka") {
      routeLinkBase = '/ka/routes/';
    }
    routeMoreInfo.href = `${routeLinkBase}${route.ref}`;
    routeMoreInfo.innerHTML = LS.translate("view_route_details");
    routeMoreInfo.setAttribute("target", "_blank");

    return { html: routeLine, time: Date.parse("1970-01-01T" + time) };
  }

  setupEventListeners() {
    this.container.querySelectorAll(".route-line").forEach((element) => {
      const routeLink = element.querySelector(".route-link");
      const routeMoreInfo = element.querySelector(".route-more-info");
      const routeShow = element.querySelector(".route-show");
      routeLink.addEventListener("click", async () => {
        this.container.style.pointerEvents = "none";
        this.container.style.opacity = "0.7";
        try {
          this.closeOtherRoutes(routeLink);
          element.classList.toggle("active");
          routeLink.classList.toggle("active");
          routeMoreInfo.classList.toggle("active");
          routeShow.classList.toggle("active");
          this.showLoader();
          await toggleRoute(routeLink.getAttribute("id"));
          this.hideLoader();
        } finally {
          this.container.style.pointerEvents = "auto";
          this.container.style.opacity = "1";
        }
      });
    });
    this.container.querySelectorAll(".route-show").forEach((element) => {
        element.addEventListener("click", () => {
            UIStateManager.closePanel();
        });
    });
  }


  closeOtherRoutes(routeLink) {
    this.container.querySelectorAll(".route-line").forEach((element) => {
      element.classList.remove("active");
      const otherRouteLink = element.querySelector(".route-link");
      const otherRouteMoreInfo = element.querySelector(".route-more-info");
      const otherRouteShow = element.querySelector(".route-show");
      if (otherRouteLink !== routeLink) {
        otherRouteLink.classList.remove("active");
        otherRouteMoreInfo.classList.remove("active");
        otherRouteShow.classList.remove("active");
      }
    });
  }

  // TODO: Move to a separate class
  showLoader() {
    const mapContainer = document.querySelector('#map');
    let loader = document.createElement('div');
    loader.classList.add('route-loader');
    loader.innerHTML = `<div class="loading-text">${LS.translate('loading_route')}</div>`
    mapContainer.appendChild(loader);
  }

  hideLoader() {    
    const loader = document.querySelector('.route-loader');
    if (loader) {
      loader.remove();
    }
  }
}
