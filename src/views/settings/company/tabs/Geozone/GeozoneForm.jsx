import { Polygon } from "@pbe/react-yandex-maps";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGeozone } from "services/v2/geozone";
import Modal from "components/ModalV2";
import Button from "components/Button/Buttonv2";
import YandexMap from "components/YandexMap";

const GeozoneForm = ({
  id,
  open,
  setOpen,
  geozonePoints,
  setGeozonePoints,
  values,
  setFieldValue,
}) => {
  const [clear, setClear] = useState(false);
  const { t } = useTranslation();
  const polygonRef = useRef(null);
  const { postGeozone } = useGeozone({
    postProps: {
      onSuccess: (res) => {
        setFieldValue("geozone_id", res?.id);
        setOpen(false);
      },
    },
  });
  const { putGeozone } = useGeozone({
    putProps: {
      enabled: !!values?.geozone_id,
      onSuccess: () => {
        setOpen(false);
      },
    },
  });

  const onSubmit = () => {
    values?.geozone_id
      ? putGeozone.mutate({
          id: values?.geozone_id,
          name: values?.name,
          points: polygonRef.current.geometry
            .getCoordinates()[0]
            .map((coords) => {
              return {
                lat: coords[0]?.toString(),
                lon: coords[1]?.toString(),
              };
            }),
        })
      : postGeozone.mutate({
          name: values?.name,
          points: polygonRef.current.geometry
            .getCoordinates()[0]
            .map((coords) => {
              return {
                lat: coords[0]?.toString(),
                lon: coords[1]?.toString(),
              };
            }),
        });
  };

  const handleClear = () => {
    setClear(true);
    setGeozonePoints([]);
    setClear(false);
  };

  const draw = (ref) => {
    ref.editor.startDrawing();
    polygonRef.current = ref;
  };

  return (
    <Modal
      open={open}
      title={id ? t("edit_geozone") : t("create_geozone")}
      onClose={() => {
        !values?.geozone_id && setGeozonePoints([]);
        setOpen(false);
      }}
      maxWidth="md"
      fullWidth={true}
    >
      <YandexMap
        style={{ width: "100%", height: "60vh" }}
        modules={["geoObject.addon.editor"]}
      >
        <Polygon
          instanceRef={(ref) => ref && draw(ref)}
          geometry={[geozonePoints]}
          options={{
            editorDrawingCursor: "crosshair",
            fillColor: "#00FF00",
            fillOpacity: 0.5,
            strokeColor: "#0000FF",
            strokeWidth: 3,
          }}
          onGeometryChange={() => {
            const coords = polygonRef.current.geometry.getCoordinates();
            setGeozonePoints(coords[0]);
          }}
          clear={clear}
        />
      </YandexMap>
      <div className="flex gap-3 mt-4">
        <Button
          variant="outlined"
          color="error"
          fullWidth
          disabled={!geozonePoints.length}
          onClick={handleClear}
        >
          Сбросить
        </Button>
        <Button variant="contained" fullWidth onClick={onSubmit}>
          {geozonePoints?.length > 0 ? t("save") : t("add")}
        </Button>
      </div>
    </Modal>
  );
};

export default GeozoneForm;
