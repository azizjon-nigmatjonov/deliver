import { SET_USER_PERMISSIONS } from "redux/constants";

export default function permissionsReducer(state = [], { type, payload }) {
  switch (type) {
    case SET_USER_PERMISSIONS:
      return {
        ...state,
        ...payload,
      };
    default: {
      return state;
    }
  }
}
