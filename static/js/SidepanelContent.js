import { getRoutesByStation, getRouteTimeByStation, createRouteScheduleString, getRouteSchedule, getRoutePoints, getStationNameByCode, toggleRoute } from "./main-test.js";
import { LanguageService as LS } from "./LanguageService.js";

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
    let routeLink = document.createElement("a");
    let routeTime = document.createElement("div");
    let routeLabel = document.createElement("span");
    let routeDestination = document.createElement("span");
    let routeName = document.createElement("div");
    let routeMoreInfo = document.createElement("a");

    routeLine.appendChild(routeTime);
    routeLine.appendChild(routeName);
    routeName.appendChild(routeLink);
    routeLink.appendChild(routeLabel);
    routeLink.appendChild(routeDestination);
    routeLine.appendChild(routeMoreInfo);

    routeLine.classList.add("route-line");
    routeLink.classList.add("route-link");
    routeTime.classList.add("route-time");
    routeLabel.classList.add("route-label");
    routeDestination.classList.add("route-destination");
    routeName.classList.add("route-name");
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

    let routeLinkBase = '/routes/';
    if (LS.getCurrentLanguage() == "ru") {
        routeLinkBase = '/ru/routes/';
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
      routeLink.addEventListener("click", async () => {
        this.container.style.pointerEvents = "none";
        this.container.style.opacity = "0.7";
        try {
          this.closeOtherRoutes(routeLink);
          element.classList.toggle("active");
          routeLink.classList.toggle("active");
          routeMoreInfo.classList.toggle("active");
          this.showLoader();
          await toggleRoute(routeLink.getAttribute("id"));
          this.hideLoader();
        } finally {
          this.container.style.pointerEvents = "auto";
          this.container.style.opacity = "1";
        }
      });
    });
  }

  closeOtherRoutes(routeLink) {
    this.container.querySelectorAll(".route-line").forEach((element) => {
      element.classList.remove("active");
      const otherRouteLink = element.querySelector(".route-link");
      const otherRouteMoreInfo = element.querySelector(".route-more-info");
      if (otherRouteLink !== routeLink) {
        otherRouteLink.classList.remove("active");
        otherRouteMoreInfo.classList.remove("active");
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
