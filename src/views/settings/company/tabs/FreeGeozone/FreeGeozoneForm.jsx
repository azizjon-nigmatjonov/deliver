import { Placemark, Polygon } from "@pbe/react-yandex-maps";
import React, { useEffect, useRef, useState } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { useFreeGeozone } from "services/v2/free_geozone";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Input } from "alisa-ui";
import { showAlert } from "redux/actions/alertActions";
import { useDispatch } from "react-redux";
import YandexMap from "components/YandexMap";
import { Box, IconButton } from "@mui/material";
import Header from "components/Header";
import { ArrowBack } from "@mui/icons-material";
import Button from "components/Button/Buttonv2";

const FreeGeozoneForm = () => {
  const [coords, setCoords] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [clear, setClear] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const mapRef = useRef(null);
  const polygonRef = useRef(null);
  const dispatch = useDispatch();

  useFreeGeozone({
    byIDParams: id,
    ByIDProps: {
      enabled: !!id,
      onSuccess: (res) => {
        setCoords(res?.points.map((locations) => Object.values(locations)));
        setInputValue(res?.name);
      },
    },
  });

  const { postFreeGeozone } = useFreeGeozone({
    postProps: {
      onSuccess: () => {
        history.push("/home/settings/company?tab=3");
      },
    },
  });
  const { putFreeGeozone } = useFreeGeozone({
    putProps: {
      enabled: !!id,
      onSuccess: () => {
        history.push("/home/settings/company?tab=3");
      },
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates([latitude, longitude]);
      });
    }
  }, []);

  const onSubmit = () => {
    if (inputValue.length > 0) {
      id
        ? putFreeGeozone.mutate({
            id: id,
            name: inputValue,
            points: polygonRef.current.geometry
              .getCoordinates()[0]
              .map((coords) => {
                return {
                  lat: coords[0].toString(),
                  lon: coords[1].toString(),
                };
              }),
          })
        : postFreeGeozone.mutate({
            name: inputValue,
            points: polygonRef.current.geometry
              .getCoordinates()[0]
              .map((coords) => {
                return {
                  lat: coords[0].toString(),
                  lon: coords[1].toString(),
                };
              }),
          });
    } else {
      dispatch(showAlert(t("enter_title"), "error"));
    }
  };

  const handleClear = () => {
    setClear(true);
    setCoords([]);
  };

  const draw = (ref) => {
    ref.editor.startDrawing();
    polygonRef.current = ref;
  };

  const headerButtons = (
    <>
      <Button
        startIcon={<CancelIcon />}
        size="large"
        variant="outlined"
        color="error"
        onClick={() => history.push("/home/settings/company?tab=3")}
      >
        {t("cancel")}
      </Button>

      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        size="large"
        type="submit"
        onClick={onSubmit}
      >
        {t("save")}
      </Button>
    </>
  );

  const headerTitle = (
    <div className="flex gap-3 items-center">
      <IconButton
        variant="outlined"
        onClick={() => history.push("/home/settings/company?tab=2")}
      >
        <ArrowBack />
      </IconButton>
      <p>{id ? t("edit_geozone") : t("create_geozone")}</p>
    </div>
  );

  return (
    <div
      style={{ minHeight: "100vh" }}
      className="flex flex-col justify-between"
    >
      <div>
        <Header title={headerTitle} />
        <Box sx={{ maxWidth: { xs: "100%", lg: "50%" }, width: "100%" }}>
          <Card title="Общие сведение" className="m-4 ">
            <div>
              <span className="input-label">Названия геозону</span>
              <div>
                <Input
                  placeholder={t("name")}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            </div>
            <div className="my-4" style={{ height: 500 }}>
              <YandexMap mapRef={mapRef} modules={["geoObject.addon.editor"]}>
                <Polygon
                  instanceRef={(ref) => ref && draw(ref)}
                  geometry={[coords]}
                  options={{
                    editorDrawingCursor: "crosshair",
                    fillColor: "#00FF00",
                    fillOpacity: 0.5,
                    strokeColor: "#0000FF",
                    strokeWidth: 3,
                  }}
                  clear={clear}
                  onGeometryChange={() => {
                    const coor = polygonRef.current.geometry.getCoordinates();
                    setCoords(coor[0]);
                  }}
                />
                <Placemark
                  geometry={coordinates}
                  options={{ preset: "islands#geolocationIcon" }}
                />
              </YandexMap>
            </div>
            {coords.length > 0 && (
              <Button color="error" fullWidth onClick={handleClear}>
                Сбросить
              </Button>
            )}
          </Card>
        </Box>
      </div>
      <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
        {headerButtons}
      </div>
    </div>
  );
};

export default FreeGeozoneForm;
