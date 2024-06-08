import { store } from "../redux/store";
import { showAlert } from "redux/actions/alertActions";

var coords;

export default function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
    return coords;
  } else {
    store.dispatch(
      showAlert("Geolocation is not supported by this browser.", "error"),
    );
  }
}

function handleError(error) {
  let errorStr;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorStr = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      errorStr = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      errorStr = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      errorStr = "An unknown error occurred.";
      break;
    default:
      errorStr = "An unknown error occurred.";
  }
  store.dispatch(showAlert("Error occurred: " + errorStr, "error"));
}

function showPosition(position) {
  coords = `${position.coords.longitude}, ${position.coords.latitude}`;
}
