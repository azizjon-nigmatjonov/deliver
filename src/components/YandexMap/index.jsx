import { useState } from "react";
import {
  YMaps,
  Map,
  ZoomControl,
  SearchControl,
  GeolocationControl,
  FullscreenControl,
  TrafficControl,
  TypeSelector,
} from "@pbe/react-yandex-maps";
import apikeyService, { useApiKeysIdList } from "services/v2/api_keys_ids";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function YandexMap({
  defaultState,
  mapRef,
  onMapClick = () => {},
  onGetAddress = () => {},
  onGeolocationClick = () => {},
  onLoad = () => {},
  children,
  ...props
}) {
  const [apikey, setApikey] = useState("");
  const dishpatch = useDispatch();
  const { t } = useTranslation();

  const { isLoading } = useApiKeysIdList({
    params: { page: 1, limit: 10, type: "geocoder" },
    props: {
      enabled: mapRef ? true : false,
      onSuccess: (data) => data?.ids?.length > 0 && setApikey(data?.ids[0]),
    },
  });

  const getAddress = async (coords) => {
    if (onGetAddress) {
      if (mapRef && !apikey) {
        dishpatch(showAlert(t("you_are_run_out_of_api_keys"), "warning"));
      } else if (apikey) {
        try {
          const response = await axios.get(
            `https://geocode-maps.yandex.ru/1.x/?apikey=${apikey}&geocode=${String(
              coords,
            )}&lang=ru_RU&format=json`,
          );

          if (response?.data) {
            const geoObject =
              response?.data?.response?.GeoObjectCollection?.featureMember[0]
                ?.GeoObject;
            onGetAddress({
              label: `${geoObject?.name}, ${geoObject?.description.replace(
                ", Узбекистан",
                "",
              )}`,
              location: geoObject?.Point,
            });
          }
        } catch (error) {
          if (error.response.data.message === "Invalid key") {
            apikeyService
              .update(apikey)
              .then(() =>
                axios.post(
                  "https://api.telegram.org/bot6019506569:AAFrnMLirS_wl1aBeqK8yaTsHzZb1eTZ7J0/sendMessage?chat_id=-1001980050301&text=" +
                    apikey +
                    " is stopped",
                ),
              );
          }
        }
      }
    }
  };

  const onClickHandler = (e) => {
    if (onMapClick || onGetAddress) {
      if (mapRef && !apikey) {
        dishpatch(showAlert(t("you_are_run_out_of_api_keys"), "warning"));
      } else if (apikey) {
        const coords = e.get("coords").reverse();
        getAddress(coords);
        onMapClick(e);
      }
    }
  };

  const setPoisition = (position, address) => {
    mapRef.current?.setCenter(position, undefined, {
      duration: 300,
    });
    onGeolocationClick(position);
    address && getAddress(position);
  };

  const onLocationChange = (event) => {
    if (onGeolocationClick) {
      var position = event.get("position");
      setPoisition(position, "address");
    }
  };

  if (mapRef && isLoading)
    return (
      <p>Loading...</p>
      // <div className="map-loader">
      //   <CircularProgress size={40} style={{ color: "var(--primary-color)" }} />
      // </div>
    );

  return apikey ? (
    <YMaps
      query={{
        apikey,
        lang: "ru_RU",
      }}
    >
      <Map
        defaultState={
          defaultState || {
            center: [41.292906, 69.24132],
            zoom: 11,
          }
        }
        onClick={onClickHandler}
        width="100%"
        height="100%"
        onLoad={onLoad}
        instanceRef={mapRef}
        onError={() => console.log("yandex error", 123)}
        {...props}
      >
        <ZoomControl /> <SearchControl options={{ size: "large" }} />
        <GeolocationControl
          options={{ noPlacemark: true }}
          onLocationChange={onLocationChange}
        />
        <FullscreenControl />
        <TrafficControl />
        <TypeSelector />
        {children}
      </Map>
    </YMaps>
  ) : (
    <YMaps>
      <Map
        defaultState={
          defaultState || {
            center: [41.292906, 69.24132],
            zoom: 11,
          }
        }
        width="100%"
        height="100%"
        onClick={onClickHandler}
        {...props}
      >
        <ZoomControl />
        <FullscreenControl />
        <TrafficControl />
        <TypeSelector />
        {children}
      </Map>
    </YMaps>
  );
}
