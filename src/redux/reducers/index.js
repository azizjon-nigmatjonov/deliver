import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import authReducer from "./authReducer";
import alertReducer from "./alertReducer";
import systemReducer from "./systemReducer";
import langReducer from "./langReducer";
import tableReducer from "./tableReducer";
import permissionsReducer from "./permissionsReducer";
import { socketReducer, websocketReducer } from "./socketReducer";
import { orderHistoryReducer } from "./orderHistoryReducer";
import { socketMessageReducer } from "./socketReducer";
import { allOrderReducer } from "./reportSocketReducer";
import { reportExcelDownloadReducer } from "./reportExcelDownload";
import { lateTimeReducer } from "./lateTimeReducer";
import filtersReducer from "./filtersReducer";

const authPersistConfig = {
  key: "auth",
  storage,
};

const langPersistConfig = {
  key: "lang",
  storage,
};

const tablePersistConfig = {
  key: "table",
  storage,
};

const lateTimePersistConfig = {
  key: "lateTime",
  storage,
};

const filtersPersistConfig = {
  key: "orderFilters",
  storage,
};

var rootReducer = combineReducers({
  alert: alertReducer,
  system: systemReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  lang: persistReducer(langPersistConfig, langReducer),
  table: persistReducer(tablePersistConfig, tableReducer),
  lateTime: persistReducer(lateTimePersistConfig, lateTimeReducer),
  orderFilters: persistReducer(filtersPersistConfig, filtersReducer),
  orderHistoryReducer,
  
  userPermissions: permissionsReducer,
  socketData: socketReducer,
  socketMessageData: socketMessageReducer,
  ws: websocketReducer,
  allOrderReport: allOrderReducer,
  allReportExcel: reportExcelDownloadReducer,
});

export default rootReducer;
