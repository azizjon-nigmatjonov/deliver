import { SET_SOCKET, SET_SOCKET_MESSAGE, SET_WEBSOCKET, SET_EDITING_ORDERS } from "redux/constants";

export const socketReducer = (state = [], { type, payload }) => {
  switch (type) {
    case SET_SOCKET:
      return {
        ...state,
        socket_data: payload,
      };
    case SET_EDITING_ORDERS:
      return {
        ...state,
        editing_orders: payload,
      };
    default:
      return state;
  }
};

export const socketMessageReducer = (state = [], { type, payload }) => {
  switch (type) {
    case SET_SOCKET_MESSAGE:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export const websocketReducer = (state = [], { type, payload }) => {
  switch (type) {
    case SET_WEBSOCKET:
      return {
        ...state,
        websocket: payload,
      };
    default:
      return state;
  }
};
