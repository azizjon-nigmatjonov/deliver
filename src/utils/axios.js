import axios from "axios";
import config from "config/defaultSettings";
import { logout } from "redux/actions/authActions";
import { store } from "redux/store";
import { REFRESH_ACCESS_TOKEN } from "redux/constants";
import { showAlert } from "redux/actions/alertActions";
// import { stackMessages } from "./stackMessages";

var request = axios.create({
  baseURL: config.baseURL,
  timeout: 60000,
});

// var waitingTime = 8000;

request.interceptors.request.use((config) => {
  var token = store.getState().auth.accessToken;
  // config.headers["client-id"] = process.env.CLIENT_ID
  // config.headers["platform-id"] = "7d4a4c38-dd84-4902-b744-0488b80a4c01"
  if (token) {
    config.headers.Authorization = token; // `Bearer ${token}`
  }
  return config;
}, errorHandler);

request.interceptors.response.use((response) => response.data, errorHandler);

export function errorHandler(error, hooks) {
  if (error.response) {
    if (error?.response?.data?.Error?.Message) {
      if (
        error?.response?.data?.Error?.Message ===
        'Failed to create order: ERROR: invalid input syntax for type uuid: "" (SQLSTATE 22P02)'
      )
        store.dispatch(showAlert("Клиент не создан"));
      else store.dispatch(showAlert(error?.response?.data?.Error?.Message));
    }

    if (error.response.status === 403 || error.response.status === 401) {
      var refresh_token = store.getState().auth.refreshToken;
      var access_token = store.getState().auth.accessToken;

      if (refresh_token) {
        request
          .put("/shipper-users/refresh-token", {
            refresh_token,
          })
          .then((res) => {
            var a_token = res?.data?.access_token;
            var r_token = res?.data?.refresh_token;
            if (a_token && r_token) {
              store.dispatch({
                type: REFRESH_ACCESS_TOKEN,
                payload: {
                  access_token: a_token,
                  refresh_token: r_token,
                },
              });
              window.location.reload();
            }
          })
          .catch((err) => {
            store.dispatch(logout());
          });
      } else if (window.location.pathname !== "/auth/login" && access_token) {
        store.dispatch(logout());
      }
    }
  }
  return Promise.reject(error.response);
}

export default request;

