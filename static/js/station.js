import { map } from "./map.js";

const options = {
  capitalDefault: {
    icon: "star",
    iconSize: [23, 23],
    iconShape: "circle",
    borderColor: "#c1121f",
    textColor: "#c1121f",
  },
  capitalActive: {
    icon: "star",
    iconSize: [23, 23],
    iconShape: "circle",
    borderColor: "#c1121f",
    textColor: "#fff",
    backgroundColor: "#c1121f",
  },
  airportDefault: {
    icon: "plane",
    iconSize: [22, 22],
    iconShape: "circle",
    borderColor: "#c1121f",
    textColor: "#c1121f",
  },
  airportActive: {
    icon: "plane",
    iconSize: [22, 22],
    iconShape: "circle",
    borderColor: "#c1121f",
    textColor: "#fff",
    backgroundColor: "#c1121f",
  },
  beachDefault: {
    icon: "sun-o",
    iconSize: [23, 23],
    iconShape: "circle",
    borderColor: "#c1121f",
    textColor: "#c1121f",
  },
  beachActive: {
    icon: "sun-o",
    iconSize: [23, 23],
    iconShape: "circle",
    borderColor: "#c1121f",
    textColor: "#fff",
    backgroundColor: "#c1121f",
  },
  commonDefault: {
    iconShape: "circle",
    borderColor: "#c1121f",
    textColor: "#c1121f",
    iconSize: [18, 18],
    isAlphaNumericIcon: true,
    text: "",
  },
  commonActive: {
    iconShape: "circle",
    borderColor: "#fff",
    textColor: "#c1121f",
    iconSize: [18, 18],
    isAlphaNumericIcon: true,
    text: "",
    backgroundColor: "#c1121f",
  },
};

export class Station {
  constructor(name, coords, type, code) {
    this.name = name,
    this.coords = coords,
    this.type = type,
    this.code = code,
    this.active = false,
    this.marker = L.marker(this.coords).bindTooltip(this.name, {offset: [10, 0]}),
    this.updateMarkerStyle();
    this.show();
  }

  // Updates marker style based on station type
  // TODO: Change types name in the source data
  updateMarkerStyle() {
    const defaultStyleMap = {
      secondary: options.commonDefault,
      main: options.capitalDefault,
      airport: options.airportDefault,
      beach: options.beachDefault,
    }

    const activeStyleMap = {
      secondary: options.commonActive,
      main: options.capitalActive,
      airport: options.airportActive,
      beach: options.beachActive,
    }

    const style = this.active ? activeStyleMap[this.type] : defaultStyleMap[this.type];
    if (style) {
      this.marker.setIcon(L.BeautifyIcon.icon(style));
    }
  }

  show() {
    this.marker.addTo(map);
  }

  setDefault() {
    this.active = false;
    this.updateMarkerStyle();
  }

  setActive() {
    this.active = true;
    this.updateMarkerStyle();
  }

  hide() {
    this.marker.remove();
  }

  changeState() {
    this.active ? this.setDefault() : this.setActive();
  }
}
