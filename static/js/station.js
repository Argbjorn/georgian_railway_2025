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
    this.marker = L.marker(this.coords),
    this.updateMarkerStyle();



    // if (this.type == "main") {
    //     this.BeautifyIconOptionsDefault = options.mainDefault;
    //     this.BeautifyIconOptionsActive = options.mainActive;
    // } else if (this.type == "secondary") {
    //     this.BeautifyIconOptionsDefault = options.secondaryDefault;
    //     this.BeautifyIconOptionsActive = options.secondaryActive;
    // } else if (this.type == "airport") {
    //     this.BeautifyIconOptionsDefault = options.airportDefault;
    //     this.BeautifyIconOptionsActive = options.airportActive;
    // } else if (this.type == "beach") {
    //     this.BeautifyIconOptionsDefault = options.beachDefault;
    //     this.BeautifyIconOptionsActive = options.beachActive;
    // };
    // this.markerDefault = L.marker(this.coords, {
    //     icon: L.BeautifyIcon.icon(this.BeautifyIconOptionsDefault)
    // });
    // this.markerActive = L.marker(this.coords, {
    //     icon: L.BeautifyIcon.icon(this.BeautifyIconOptionsActive)
    // });
  }

  // Updates marker style based on station type
  // TODO: Change types name in the source data
  updateMarkerStyle() {
    if (this.type == "main" && this.active) {
      this.marker.setIcon(L.BeautifyIcon.icon(options.capitalActive));
    } else if (this.type == "main" && !this.active) {
      this.marker.setIcon(L.BeautifyIcon.icon(options.capitalDefault));
    } else if (this.type == "airport" && this.active) {
      this.marker.setIcon(L.BeautifyIcon.icon(options.airportActive));
    } else if (this.type == "airport" && !this.active) {
      this.marker.setIcon(L.BeautifyIcon.icon(options.airportDefault));
    } else if (this.type == "beach" && this.active) {
      this.marker.setIcon(L.BeautifyIcon.icon(options.beachActive));
    } else if (this.type == "beach" && !this.active) {
      this.marker.setIcon(L.BeautifyIcon.icon(options.beachDefault));
    } else if (this.type == "secondary" && this.active) {
      this.marker.setIcon(L.BeautifyIcon.icon(options.commonActive));
    } else if (this.type == "secondary" && !this.active) {
      this.marker.setIcon(L.BeautifyIcon.icon(options.commonDefault));
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
}
