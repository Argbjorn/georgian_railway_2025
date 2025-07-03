// Временно отключен весь функционал для миграции на MapLibre GL
// Оставляем только базовую инициализацию карты

/*
import { RailwayNetwork } from "./railway-network.js";
import { Route } from "./route.js";
import { routesList } from "./routes-list.js";
import { Station } from "./station.js";
import { stations as stationsList } from "./stations-list.js";
*/
// import { map } from "./map.js";
/*
import { LanguageService as LS } from "./LanguageService.js";
import { SidepanelContent } from "./SidepanelContent.js";
import UIStateManager from "./state/UIStateManager.js";
import { Poi, poiInfo } from "./poi.js";

let routes = [];
let stations = [];
let pois = [];

// Getting data

// Returns JSON with overpass-turbo data
export async function getOverpassData(query) {
  var result = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: "data=" + encodeURIComponent(query),
  }).then((data) => data.json());
  return result;
}

// Returns JSON with local routes data
export async function getRoutesData(routeId) {
  const path = `/data/routes_geodata/${routeId}.json`;
  var result = await fetch(path, {
    method: "GET",
  }).then((data) => data.json());
  return result;
}

// Map layers

// Creates a route
async function createRoute(routeId) {
  const newRoute = new Route(routeId);
  let route = L.featureGroup();
  const routeData = await getRoutesData(routeId);
  let routeStations = [];

  // Sets bounds for fly to bounds
  const b = routeData.bounds;
  newRoute.setBounds(
    L.latLngBounds([b.minlat - 1, b.minlon], [b.maxlat + 1, b.maxlon + 1])
  ); // Corrections are for better pan with an opened sidepanel

  routeData.members.forEach(async (member) => {
    // Gathers route relation's ways and combine them in an one polyline
    if (member.type == "way") {
      route.addLayer(L.polyline(member.geometry, newRoute.polylineOptions));
    }
    else if (member.role == "stop") {
      routeStations.push(member);
    }
  });
  
  // Creates all the route's stations markers
  routeStations.forEach((element) => {
    const names = {
      'en': "unknown station",
      'ru': "неизвестная станция",
      'ka': "სამოცნელო სტაციონი"
    };
    for (const station of stationsList) {
      if (station.id.includes(element.ref)) {
        names['en'] = station.name_en;
        names['ru'] = station.name_ru;
        names['ka'] = station.name_ka;
        break;
      }
    };

    route.addLayer(
      L.circleMarker(
        [element.lat, element.lon],
        newRoute.cirkleMarkerOptions
      ).bindTooltip(names[LS.getCurrentLanguage()], {
        permanent: false,
        direction: "top",
        opacity: 0.9,
      })
    );
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
}

// Shows stations and sets station markers interaction
async function showStations() {
  stationsList.forEach((station) => {
    let name;
    const currentLanguage = LS.getCurrentLanguage();
    if (currentLanguage == "en") {
      name = station.name_en;
    } else if (currentLanguage == "ru") {
      name = station.name_ru;
    } else if (currentLanguage == "ka") {
      name = station.name_ka;
    }
    
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

// Функция для отправки событий в аналитику
function sendAnalyticsEvent(eventName, eventParams = {}) {
  try {
    // Отправка события в Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', eventName, eventParams);
      console.log('GA4 событие отправлено:', eventName, eventParams);
    }
    
    // Отправка события в Яндекс.Метрику
    if (typeof ym === 'function') {
      const metrikaId = '99610233'; // Используем реальный ID метрики
      ym(metrikaId, 'reachGoal', eventName, eventParams);
      console.log('Яндекс.Метрика событие отправлено:', eventName, eventParams);
    }
  } catch (error) {
    console.error('Ошибка при отправке события аналитики:', error);
  }
}

async function showPoi() {
  let description;
  const currentLanguage = LS.getCurrentLanguage();
  poiInfo.forEach((poi) => {
    if (currentLanguage == "en") {
      description = poi.description_en;
    } else if (currentLanguage == "ru") {
      description = poi.description_ru;
    } else if (currentLanguage == "ka") {
      description = poi.description_ka;
    }
    let newPoi = new Poi(description, poi.coords);
    
    // Добавляем обработчик клика для отслеживания в аналитике
    newPoi.marker.on("click", () => {
      sendAnalyticsEvent('poi_click', {
        language: currentLanguage
      });
    });
    
    pois.push(newPoi);
  });
}

// Handling with routes data

// Returns station code by name_en
function getStationCode(name_en) {
  return name_en.toLowerCase().split(' ').join('').replace('-', '');
}

// Returns the station name from raw overpass data, if exists
function getStationName(data) {
  let stationName;
  const lang = LS.getCurrentLanguage();
  if ("name_" + lang in data) {
    stationName = data["name_" + lang];
  } else if ("name" in data) {
    stationName = data["name"];
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
      const currentLanguage = LS.getCurrentLanguage();
      if (currentLanguage == "en") {
        stationName = station.name_en;
      } else if (currentLanguage == "ru") {
        stationName = station.name_ru;
      } else if (currentLanguage == "ka") {
        stationName = station.name_ka;
      }
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
      if (!route.has_arrival_time) {
        routeTime = station.departure_time;
      } else {
        if (station.role === 'start') {
          routeTime = station.departure_time;
        } else {
          routeTime = station.arrival_time;
        }
      }
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
showPoi();

// Добавляем подсказку о кликабельных станциях
function createStationHint() {
  // Проверяем, видел ли пользователь подсказку раньше
  if (localStorage.getItem('stationHintShown') === 'true') {
    return;
  }
  
  // Получаем контейнер карты
  const mapContainer = document.getElementById('map');
  
  // Создаем элемент подсказки
  const hintElement = document.createElement('div');
  hintElement.className = 'station-hint';
  hintElement.innerHTML = `
    <div class="hint-content">
      <span>${LS.translate("station_hint_text") || "Нажмите на станцию, чтобы увидеть расписание поездов"}</span>
      <button class="hint-close-btn">&times;</button>
    </div>
  `;
  
  // Добавляем в контейнер карты
  mapContainer.appendChild(hintElement);
  
  // Обработчик для кнопки закрытия
  const closeBtn = hintElement.querySelector('.hint-close-btn');
  closeBtn.addEventListener('click', () => {
    hintElement.remove();
    localStorage.setItem('stationHintShown', 'true');
  });
  
  // Скрываем подсказку при открытии панели
  UIStateManager.subscribe("panel", (panelState) => {
    if (panelState.isOpen && hintElement.parentElement) {
      hintElement.remove();
      localStorage.setItem('stationHintShown', 'true');
    }
  });
}

// Вызываем создание подсказки после загрузки карты и добавляем класс loaded к body для показа sidepanel
setTimeout(() => {
    createStationHint();
    document.body.classList.add('loaded');
}, 1500);
*/