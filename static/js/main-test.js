import { RailwayNetwork } from "./railway-network.js";
import { Route } from "./route.js";
import { routesList } from "./routes-list.js";
import { Station } from "./station.js";
import { stations as stationsList } from "./stations-list.js";
import { map } from "./map.js";
import { LanguageService as LS } from "./LanguageService.js";
import { SidepanelContent } from "./SidepanelContent.js";
import UIStateManager from "./state/UIStateManager.js";

let routes = [];
let stations = [];

// Getting data

// Returns JSON with overpass-turbo data
export async function getOverpassData(query) {
  var result = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: "data=" + encodeURIComponent(query),
  }).then((data) => data.json());
  return result;
}

// Map layers

// Creates a route
async function createRoute(routeId) {
  const newRoute = new Route(routeId);
  let route = L.featureGroup();
  const routeData = await getOverpassData(newRoute.query);

  // Sets bounds for fly to bounds
  const b = routeData.elements[0].bounds;
  newRoute.setBounds(
    L.latLngBounds([b.minlat - 1, b.minlon], [b.maxlat + 1, b.maxlon + 1])
  ); // Corrections are for better pan with an opened sidepanel

  routeData.elements.forEach(async (element) => {
    let stations = [];
    element.members.forEach(async (member) => {
      // Gathers route relation's ways and combine them in an one polyline
      if (member.type == "way") {
        route.addLayer(L.polyline(member.geometry, newRoute.polylineOptions));
      }
      // Gathers route relation nodes (stations)
      else if (member.type == "node") {
        stations.push(member.ref);
      }
    });
    // Combines overpass query to gather all the stations data
    let query = "[out:json][timeout:25];(";
    stations.forEach((station) => {
      query += "node(" + station + ");";
    });
    query += ");out geom;";
    // Runs overpass query
    const stationData = await getOverpassData(query);
    // Creates all the station markers
    stationData.elements.forEach((element) => {
      route.addLayer(
        L.circleMarker(
          [element.lat, element.lon],
          newRoute.cirkleMarkerOptions
        ).bindTooltip(getStationName(element), {
          permanent: false,
          direction: "top",
          opacity: 0.9,
        })
      );
    });
  });
  newRoute.setFeatureGroup(route);
  routes.push(newRoute);
  return newRoute;
}

// Returns a new route or existing one
async function getRoute(routeId) {
  const isRouteExists = (currentRoute) => currentRoute.id == routeId;
  if (!routes.some(isRouteExists)) {
    return createRoute(routeId);
  } else {
    return routes.find((r) => r.id == routeId);
  }
}

// Handles what route (or network) has to be shown/hide on the map
export async function toggleRoute(routeId) {
  UIStateManager.log("toggleRoute - the beginning");
  // Other route is shown on the map (so it has to hide the old one and show the new one)
  if (
    UIStateManager.mapState.activeRoute &&
    UIStateManager.mapState.activeRoute.id != routeId
  ) {
    const route = await getRoute(routeId);
    UIStateManager.mapState.activeRoute.hide();
    UIStateManager.mapState.activeRoute = route;
    route.show();
    // No routes are shown (so it has to shadow the railway network and show the route)
  } else if (!UIStateManager.mapState.activeRoute) {
    let newRoute = await getRoute(routeId);
    railwayNetwork.shadow();
    stations.forEach((station) => {
      station.hide();
    });
    if (UIStateManager.mapState.activeStation) {
      UIStateManager.mapState.activeStation.setActive();
    }
    await newRoute.show();
    UIStateManager.mapState.activeRoute = newRoute;
  }
  // Current route is shown (so it has to hide the route and show the railway network)
  else {
    UIStateManager.updateMapState({
      activeRoute: null,
      previousActiveRoute: UIStateManager.mapState.activeRoute,
    });
    stations.forEach((station) => {
      station.show();
    });
    if (UIStateManager.mapState.activeStation) {
      UIStateManager.mapState.activeStation.setActive();
    }
    railwayNetwork.show();
  }
  UIStateManager.log("toggleRoute - the end");
}

// Shows stations and sets station markers interaction
async function showStations() {
  stationsList.forEach((station) => {
    let name =
      LS.getCurrentLanguage() == "en" ? station.name_en : station.name_ru;
    let newStation = new Station(
      name,
      station.coords,
      station.type,
      station.code
    );
    stations.push(newStation);
    newStation.marker.on("click", handleStationClick.bind(null, newStation));
  });
}

async function handleStationClick(station) {
  // Clicked station is already active
  if (
    UIStateManager.mapState.activeStation &&
    UIStateManager.mapState.activeStation === station
  ) {
    UIStateManager.updateMapState({ activeStation: null });
    return;
  }
  // Clicked station is not active and there is already an active station
  if (UIStateManager.mapState.activeStation) {
    UIStateManager.updateMapState({ activeStation: station });
    UIStateManager.mapState.previousActiveStation.setDefault();
  }
  // Clicked station is not active and there is no active station
  UIStateManager.updateMapState({ activeStation: station });
}

// Handling with routes data

// Returns the station name from raw overpass data, if exists
function getStationName(data) {
  let stationName;
  if ("tags" in data) {
    const lang = LS.getCurrentLanguage();
    if ("name:" + lang in data.tags) {
      stationName = data.tags["name:" + lang];
    } else if ("name" in data.tags) {
      stationName = data.tags["name"];
    } else {
      stationName = LS.translate("unknown_station");
    }
  } else {
    stationName = LS.translate("unknown_station");
  }
  return stationName;
}

// Returns an sorted by time array with a given route schedule like [[<station1_name>, '17:05'], [<station2_name>, '22:13']]
export function getRouteSchedule(route) {
  let schedule = [];
  if ("stations" in route) {
    route.stations.forEach((station) => {
      schedule.push([station.code, station.time]);
    });
  }
  if (schedule.length > 1) {
    //schedule.sort((a, b) => Date.parse('1970-01-01T' + a[1]) > Date.parse('1970-01-01T' + b[1]) ? 1 : -1);
    return schedule;
  } else {
    return LS.translate("no_schedule");
  }
}

// Returns a schedule string (the whole schedule block for an route)
export function createRouteScheduleString(routeTiming) {
  let scheduleString = "";
  routeTiming.forEach((line) => {
    scheduleString += line[1] + " " + getStationNameByCode(line[0]) + "<br>";
  });
  return scheduleString;
}

// Returns the first, the last station and middle stations of a given route
export function getRoutePoints(route) {
  let start, end;
  let middle = [];
  route.stations.forEach((station) => {
    if (station.role == "start") {
      start = station.code;
    } else if (station.role == "end") {
      end = station.code;
    } else {
      middle.push(station.code);
    }
  });
  return [start, end, middle];
}

// Returns a name of given station by code
export function getStationNameByCode(stationCode) {
  let stationName;

  stationsList.forEach((station) => {
    if (station.code == stationCode) {
      stationName =
        LS.getCurrentLanguage() == "en" ? station.name_en : station.name_ru;
    }
  });
  if (isSet(stationName)) {
    return stationName;
  } else {
    return LS.translate("unknown_station");
  }
}

// Returns time of given route of given station by code
export function getRouteTimeByStation(route, stationCode) {
  let routeTime;
  route.stations.forEach((station) => {
    if (station.code == stationCode) {
      routeTime = station.time;
    }
  });
  return routeTime;
}

function isSet(s) {
  if (typeof s === "undefined") {
    return false;
  }
  return true;
}

// Sidepanel interactions
// Handles click on the sidepanel toggle button
document
  .querySelector(".sidepanel-toggle-button")
  .addEventListener("click", () => {
    if (UIStateManager.panelState.isOpen && !UIStateManager.isMobile) {
      UIStateManager.updateMapState({
        activeStation: null,
        activeRoute: null,
        previousActiveRoute: UIStateManager.mapState.activeRoute,
      });
    } else if (UIStateManager.panelState.isOpen && UIStateManager.isMobile) {
      UIStateManager.closePanel();
    } else if (!UIStateManager.panelState.isOpen && !UIStateManager.mapState.activeStation && !UIStateManager.mapState.activeRoute) {
      let sidepanelContent = new SidepanelContent();
      sidepanelContent.renderDefaultGreeting();
      UIStateManager.openPanel();
    }
    else {
      UIStateManager.openPanel();
    }
  });


// Subscribe to panel UI (visibility only)
UIStateManager.subscribe("panel", (panelState) => {
  const panel = document.querySelector("#mySidepanel");
  if (panelState.isOpen) {
    panel.classList.remove("closed");
    panel.classList.add("opened");
  } else {
    panel.classList.remove("opened");
    panel.classList.add("closed");
  }
});

// Subscribe to panel content (clears content on desktop when sidepanel is closing)
UIStateManager.subscribe("panel", (panelState) => {
  if (!panelState.isOpen && !UIStateManager.isMobile) {
    setTimeout(() => {
      if (!UIStateManager.mapState.activeStation) {
        panelState.content?.clear();
      }
    }, 300);
  }
});

// Subscribe to map state (stations)
UIStateManager.subscribe("map", (mapState) => {
  const previousActiveStation = mapState.previousActiveStation;
  const activeStation = mapState.activeStation;

  // Handle station change only if it's an explicit station change
  // (not an indirect change through route change)
  if (activeStation !== previousActiveStation) {
    if (!activeStation) {
      if (previousActiveStation) {
        previousActiveStation.setDefault();
      }
      if (
        UIStateManager.panelState.isOpen &&
        !UIStateManager.isMobile &&
        !mapState.activeRoute
      ) {
        UIStateManager.closePanel();
      }
    } else {
      activeStation.setActive();
      UIStateManager.openPanel();
      const content = new SidepanelContent(activeStation);
      UIStateManager.panelState.content = content;
      content.render();
    }
  }
});

// Subscribe to map state (routes)
UIStateManager.subscribe("map", (mapState) => {
  const activeRoute = mapState.activeRoute;
  const previousActiveRoute = mapState.previousActiveRoute;
  if (activeRoute) {
    activeRoute.show();
  } else {
    if (previousActiveRoute) {
      previousActiveRoute.hide();
    }
    railwayNetwork.show();
    stations.forEach((station) => {
      station.show();
    });
    closeRoutes();
  }
});

// Returns routes data connected to given station
export function getRoutesByStation(stationCode) {
  let routes = [];
  routesList.forEach((route) => {
    if ("stations" in route) {
      route.stations.forEach((station) => {
        if (station.code == stationCode) {
          routes.push(route);
        }
      });
    }
  });
  return routes;
}

// Closes route details in the sidepanel
function closeRoutes() {
  let routesLinks = document.querySelectorAll(".route-link");
  let routesSchedules = document.querySelectorAll(".route-schedule");
  routesLinks.forEach((route) => {
    route.classList.remove("active");
  });
  routesSchedules.forEach((schedule) => {
    schedule.classList.remove("active");
  });
}

// Click on the map
// TODO: Refactor this
map.addEventListener("click", () => {
  if (
    (UIStateManager.panelState.isOpen || UIStateManager.isMobile) &&
    UIStateManager.mapState.activeRoute
  ) {
    const otherRouteLine = document.querySelector(".route-line.active");
    const otherRouteMoreInfo = otherRouteLine.querySelector(
      ".route-more-info.active"
    );
    const otherRouteShow = otherRouteLine.querySelector(".route-show.active");
    otherRouteLine.classList.remove("active");
    otherRouteMoreInfo.classList.remove("active");
    otherRouteShow.classList.remove("active");
  }
  UIStateManager.updateMapState({ activeStation: null });
  if (UIStateManager.mapState.activeRoute) {
    UIStateManager.updateMapState({
      activeRoute: null,
      previousActiveRoute: UIStateManager.mapState.activeRoute,
    });
  }
});

// Show railway network
const mapContainer = document.querySelector("#map");
export let railwayNetwork = new RailwayNetwork(mapContainer);
railwayNetwork.show();

showStations();
