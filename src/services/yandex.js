import axios from "axios";

export const getAddressListYandex = (
  params,
  region = "69.241320,41.292906",
  apikey,
) =>
  axios({
    method: "get",
    url: "https://search-maps.yandex.ru/v1/",
    params: {
      ...params,
      type: "biz",
      lang: "ru_RU",
      apikey: apikey,
      results: 5,
      ll: region,
      spn: "6.5,6.5",
      rspn: 1,
    },
  });

export const getGeoCodeAddressList = (
  geocoder,
  region = "69.241320,41.292906",
  apikey,
) =>
  axios({
    method: "get",
    url: "https://geocode-maps.yandex.ru/1.x/",
    params: {
      format: "json",
      apikey: apikey,
      // apikey: 'asdasd',
      geocode: geocoder,
      sco: "latlong",
      lang: "ru-RU",
      results: 5,
      ll: region,
      // ll: "69.241320,41.292906", // new state
      // bbox: "41.311158, 69.279737~41.000085, 71.672579",
      spn: "6.5,6.5",
      rspn: 1,
    },
  });

export const getMatrixAddressList = (origins, destinations, mode = "driving") =>
  axios({
    method: "get",
    url: "https://api.routing.yandex.net/v2/distancematrix",
    params: {
      apikey: "e4a0fdcb-6367-45a1-91f5-bb2ef56c9450",
      origins: origins,
      destinations: destinations,
      mode: mode,
    },
  });
