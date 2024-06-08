import { SET_SOCKET, SET_SOCKET_MESSAGE, SET_WEBSOCKET } from "redux/constants";

export const setSocket = (val) => ({
  type: SET_SOCKET,
  payload: val,
});

export const setSocketMessage = (val) => ({
  type: SET_SOCKET_MESSAGE,
  payload: val,
});

export const setWebsocket = (val) => ({
  type: SET_WEBSOCKET,
  payload: val,
});
