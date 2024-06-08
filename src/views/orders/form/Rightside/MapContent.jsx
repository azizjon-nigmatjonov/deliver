import { useEffect, useRef } from "react";
import { Placemark } from "@pbe/react-yandex-maps";
import { CircularProgress } from "@mui/material";
import YandexMap from "components/YandexMap";

export default function MapContent({
  formik,
  branches,
  mapLoading,
  mapGeometry,
  handleUserLogs,
  placemarkGeometry,
  setPlacemarkGeometry,
}) {
  const { values, setFieldValue } = formik;
  const mapRef = useRef(null);

  const getAddress = (firstGeoObject) => {
    if (
      values?.delivery_type === "delivery" ||
      values?.delivery_type === "external"
    ) {
      setFieldValue("to_address", firstGeoObject.label);
      // setFieldValue("accommodation", firstGeoObject.getPremiseNumber() || "");
      // setFieldValue(
      //   "steps[0].destination_address",
      //   firstGeoObject.getPremise() || "",
      // );
    }
  };

  useEffect(() => {
    if (
      (values?.delivery_type === "delivery" ||
        values?.delivery_type === "external") &&
      placemarkGeometry[0] &&
      placemarkGeometry[1] &&
      mapRef.current
    ) {
      mapRef.current.setCenter(placemarkGeometry, undefined, {
        duration: 750,
        timingFunction: "ease-in",
      });
    } else if (
      values?.delivery_type === "self-pickup" &&
      values?.branch?.elm?.location?.lat &&
      values?.branch?.elm?.location?.long &&
      mapRef.current
    ) {
      mapRef.current.setCenter(
        [
          values?.branch?.elm?.location?.lat,
          values?.branch?.elm?.location?.long,
        ],
        undefined,
        {
          duration: 750,
          timingFunction: "ease-in",
        },
      );
    }
  }, [placemarkGeometry, values?.branch, values?.delivery_type]);

  const onMapClick = (e) => {
    if (
      values.delivery_type === "delivery" ||
      values.delivery_type === "external"
    ) {
      let coords = e.get("coords");
      setPlacemarkGeometry(coords.reverse());
      handleUserLogs({ name: "Адрес" });
    }
  };

  const onGeolocationClick = (coords) => {
    setPlacemarkGeometry(coords);
  };

  return (
    <div style={{ width: "100%", height: 500, position: "relative" }}>
      {mapLoading && (
        <div className="map-loader">
          <CircularProgress
            size={40}
            style={{ color: "var(--primary-color)" }}
          />
        </div>
      )}
      <YandexMap
        state={{
          center: mapGeometry,
          zoom: 13,
        }}
        mapRef={mapRef}
        onGetAddress={getAddress}
        onGeolocationClick={onGeolocationClick}
        onMapClick={onMapClick}
        modules={["Placemark", "geocode"]}
      >
        {(values.delivery_type === "delivery" ||
          values.delivery_type === "external") &&
          placemarkGeometry[0] &&
          placemarkGeometry[1] && <Placemark geometry={placemarkGeometry} />}
        {branches?.branches?.map((branch) => (
          <Placemark
            key={branch?.id}
            properties={{
              iconContent: `${branch?.name}`,
            }}
            options={{
              preset:
                values?.branch?.value === branch?.id
                  ? "islands#greenStretchyIcon"
                  : "islands#redStretchyIcon",
            }}
            geometry={[branch?.location.lat, branch?.location.long]}
          />
        ))}
      </YandexMap>
    </div>
  );
}
