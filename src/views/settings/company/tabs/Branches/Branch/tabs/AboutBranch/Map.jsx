import { useRef, useEffect } from "react";
import { Placemark, Polygon } from "@pbe/react-yandex-maps";
import Button from "components/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import YandexMap from "components/YandexMap";

export default function MapContent({
  formik: { setFieldValue },
  setOpen,
  geozonePoints,
  setGeozonePoints,
  placemarkGeometry,
  setPlacemarkGeometry,
}) {
  const mapRef = useRef(null);
  const { t } = useTranslation();

  function onGetAddress(firstGeoObject) {
    setFieldValue("address", firstGeoObject.label);
  }

  const onMapClick = (e) => {
    let location = e.get("coords");
    setFieldValue("location.lat", location[0]);
    setFieldValue("location.long", location[1]);
    setPlacemarkGeometry(location);
  };

  useEffect(() => {
    if (placemarkGeometry[0] && placemarkGeometry[1] && mapRef.current) {
      mapRef.current.setCenter(placemarkGeometry, undefined, {
        duration: 750,
        timingFunction: "ease-in",
      });
    }
  }, [placemarkGeometry]);

  const editComponentButton = (
    <>
      <Button
        icon={CancelIcon}
        size="large"
        shape="outlined"
        color="red"
        borderColor="bordercolor"
        onClick={() => setGeozonePoints([])}
      >
        {t("delete")}
      </Button>
      <Button
        icon={EditIcon}
        size="large"
        type="submit"
        onClick={(e) => {
          setOpen(true);
        }}
      >
        {t("edit")}
      </Button>
    </>
  );
  const createComponentButton = (
    <>
      <Button
        icon={AddIcon}
        size="large"
        shape="contained"
        color="blue"
        borderColor="bordercolor"
        onClick={() => {
          setOpen(true);
        }}
      >
        {t("add")}
      </Button>
    </>
  );

  return (
    <Card title={t("geofence")}>
      <div style={{ height: "350px" }}>
        <YandexMap
          onMapClick={onMapClick}
          mapRef={mapRef}
          defaultState={{
            center:
              placemarkGeometry.length > 0
                ? placemarkGeometry
                : [41.311158, 69.279737],
            zoom: 12,
          }}
          onGetAddress={onGetAddress}
          modules={["Placemark", "geocode"]}
        >
          {geozonePoints.length > 0 && (
            <Polygon
              geometry={[geozonePoints]}
              options={{
                editorDrawingCursor: "crosshair",
                fillColor: "#00FF00",
                fillOpacity: 0.5,
                strokeColor: "#0000FF",
                strokeWidth: 3,
              }}
            />
          )}
          {placemarkGeometry.length > 0 && (
            <Placemark geometry={placemarkGeometry} />
          )}
        </YandexMap>
      </div>
      <div className="flex justify-end items-center w-full bg-white pt-4 gap-5">
        {geozonePoints.length > 0 ? editComponentButton : createComponentButton}
      </div>
    </Card>
  );
}
