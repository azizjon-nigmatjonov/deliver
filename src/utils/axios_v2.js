import axios from "axios";
import config from "config/defaultSettings";
import { logout } from "redux/actions/authActions";
import { store } from "redux/store";
import { REFRESH_ACCESS_TOKEN } from "redux/constants";
import { showAlert } from "redux/actions/alertActions";
// import { stackMessages } from "./stackMessages";

var request = axios.create({
  baseURL: config.baseURL2,
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
    if (
      error?.response?.data?.Error?.Message &&
      error?.response?.data?.Error?.Message === "Crm Credentials Not Found"
    ) {
      return Promise.reject(error.response);
    } else if (
      error?.response?.data?.Error?.Message &&
      error?.response?.data?.Error?.Message !== "Rkeeper Credentials Not Found"
    ) {
      if (
        error?.response?.data?.Error?.Message ===
        'Failed to create order: ERROR: invalid input syntax for type uuid: "" (SQLSTATE 22P02)'
      )
        store.dispatch(showAlert("Клиент не создан"));
      else store.dispatch(showAlert(error?.response?.data?.Error?.Message));
    } else if (
      error.response?.data?.error ===
      "Your currently balance is not provide for changing your new Fare"
    )
      store.dispatch(
        showAlert("У вас недостаточно средств для перехода на этот тариф"),
      );
    else if (
      error.response?.data?.error ===
      "You can't change your fare to the same fare"
    )
      store.dispatch(showAlert("Вы уже на этом тарифе"));
    else if (error.response?.data?.error)
      store.dispatch(showAlert(error.response.data?.error));
    else if (error.response?.data)
      store.dispatch(showAlert(JSON.stringify(error.response?.data)));

    if (error.response.status === 403 || error.response.status === 401) {
      var refresh_token = store.getState().auth.refreshToken;
      var access_token = store.getState().auth.accessToken;
      console.log("res", error.response);
      if (refresh_token) {
        request
          .put(config.baseURL + "/shipper-users/refresh-token", {
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

// function checkResAndMess(req) {
//   return new Promise((resolve, reject) => {
//     var timeOut = setTimeout(() => {
//       reject("time out");
//     }, [waitingTime]);

//     req
//       .then((response) => {
//         try {
//           stackMessages.subscribe((mes, id) => {
//             console.log(mes, id);
//             var message = mes.find(
//               (elm) => elm.correlation_id === response.message
//             );
//             if (message) {
//               if (message.status_code < 300) {
//                 resolve({ response, message });
//               } else {
//                 reject(message.error);
//               }
//               stackMessages.remove(message.id);
//               stackMessages.unsubscribe(id);
//               clearTimeout(timeOut);
//             }
//           });
//         } catch (e) {
//           reject(e);
//         }
//       })
//       .catch((err) => reject(err));
//   });
// }

// var init = {
//   get(...args) {
//     return request.get(...args);
//   },
//   post(...args) {
//     return checkResAndMess(request.post(...args));
//   },
//   put(...args) {
//     return checkResAndMess(request.put(...args));
//   },
//   patch(...args) {
//     return checkResAndMess(request.patch(...args));
//   },
//   delete(...args) {
//     return checkResAndMess(request.delete(...args));
//   },
//   post_default(...args) {
//     return request.post(...args);
//   },
// };

// export default init;
