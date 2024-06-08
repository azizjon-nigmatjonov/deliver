import { stackMessages } from "./stackMessages";
import { store } from "../redux/store";
import {
  SET_ALL_ORDER_WS,
  SET_ALL_REPORT_DOWNLOAD_FILE,
  SET_SOCKET,
  SET_WEBSOCKET,
} from "redux/constants";
import { showNotification } from "redux/actions/alertActions";

function connectSocket() {
  const TOKEN = store.getState().auth.accessToken;

  var ws = new WebSocket(
    `${process.env.REACT_APP_WEBSOCKET_URL}?token=` + TOKEN,
  );

  store.dispatch({
    type: SET_WEBSOCKET,
    payload: ws,
  });

  ws.onopen = function () {
    console.log("Connected to the websocket");
    ws.send("{}");
  };

  ws.onmessage = function (msg) {
    try {
      var data = JSON.parse(msg.data);

      if (
        (data?.name === "interval_order_report" ||
          data?.name === "order_report") &&
        data?.percent <= 100
      ) {
        store.dispatch({
          type: SET_ALL_ORDER_WS,
          payload: data,
        });
      }

      if (data?.url) {
        store.dispatch({
          type: SET_ALL_REPORT_DOWNLOAD_FILE,
          payload: data?.url,
        });
      }

      if (data?.action === "new_order") {
        store.dispatch(showNotification(data, "info"));
      }

      store.dispatch({
        type: SET_SOCKET,
        payload: data,
      });
      stackMessages.add(data);
    } catch (err) {
      // console.log(err);
    }
  };

  ws.onclose = function (e) {
    console.log(`Socket is closed.`, e.reason);
    // connectSocket();
  };

  ws.onerror = function (err) {
    console.error("Socket encountered error: ", err.message, "Closing socket");
    ws.close();
  };

  return ws;
}

export { connectSocket };
