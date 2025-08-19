import stateManager from "../state/mapStateManager.js";
import {
  DESKTOP_BOUNDS_PADDING,
  MOBILE_BOUNDS_PADDING,
  MOBILE_SIDEBAR_HEIGHT_WINDOW_HEIGHT_RATIO,
  DESKTOP_SIDEBAR_WIDTH_IN_PIXELS,
} from "../constants.js";

// TODO: maybe there is a better way to do this, paddings for route method fitBounds work different 
// from station method easeTo
export function getBoundsPadding(type) {
  let desktopOffset = 0;
  let mobileOffset = 0;
  if (type === "station") {
    desktopOffset = DESKTOP_SIDEBAR_WIDTH_IN_PIXELS;
    mobileOffset = window.innerHeight * MOBILE_SIDEBAR_HEIGHT_WINDOW_HEIGHT_RATIO;
  }
  if (type === "route") {
    desktopOffset = 0;
    mobileOffset = -100;
  }
  if (stateManager.deviceType === "mobile") {
    return {
      top: MOBILE_BOUNDS_PADDING,
      bottom: MOBILE_BOUNDS_PADDING + mobileOffset,
      left: MOBILE_BOUNDS_PADDING,
      right: MOBILE_BOUNDS_PADDING,
    };
  } else {
    return {
      top: DESKTOP_BOUNDS_PADDING,
      bottom: DESKTOP_BOUNDS_PADDING,
      left: DESKTOP_BOUNDS_PADDING,
      right: DESKTOP_BOUNDS_PADDING + desktopOffset,
    };
  }
}
