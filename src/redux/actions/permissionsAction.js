import { SET_USER_PERMISSIONS } from "redux/constants";

export const setUserPermissions = (val) => ({
  type: SET_USER_PERMISSIONS,
  payload: val,
});
