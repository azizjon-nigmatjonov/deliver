import Card from "components/Card";
import { useState, useEffect, useMemo, useRef } from "react";
import { Placemark } from "@pbe/react-yandex-maps";
import { Input } from "alisa-ui";
import { getGeoCodeAddressList } from "services/yandex";
import Header from "components/Header";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import RegionDropDown from "./RegionDropDown";
import Button from "components/Button";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useHistory, useParams } from "react-router-dom";
import { updateRegion, postRegion, getOneRegion } from "services/region";
import Switch from "components/Switch";
import YandexMap from "components/YandexMap";
import { Box, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const CreateRegion = () => {
  const [searchValue, setSearchValue] = useState("");
  const [geocodeList, setGeocodeList] = useState([]);
  const [placemarkGeometry, setPlacemarkGeometry] = useState("");

  const mapRef = useRef();
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();

  const initialValues = useMemo(
    () => ({
      address: "",
      location: {
        lat: "",
        long: "",
      },
      is_active: true,
    }),
    [],
  );

  const onSubmit = () => {
    const data = {
      is_active: values.is_active,
      location: values.location,
      name: values.address,
    };

    let regionOptions = params.id
      ? updateRegion(params.id, data)
      : postRegion(data);

    regionOptions
      .then(history.push("/home/settings/company?tab=2"))
      .catch((error) => console.log(error));
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  const { values, setFieldValue, setValues } = formik;

  useEffect(() => {
    if (params.id) {
      getOneRegion(params.id).then((res) => {
        setValues({
          address: res?.name,
          location: res?.location,
          is_active: res?.is_active,
        });
        setPlacemarkGeometry([res?.location.lat, res?.location.long]);
      });
    }
  }, [params?.id, setValues]);

  useEffect(() => {
    if (searchValue) {
      getGeoCodeAddressList(searchValue)
        .then(
          (res) =>
            setGeocodeList(
              res?.data?.response?.GeoObjectCollection?.featureMember?.map(
                (res) => ({
                  label: res?.GeoObject.name,
                  description: res?.GeoObject.description,
                  location: res?.GeoObject.Point,
                }),
              ),
            ) ?? [],
        )
        .catch((error) => console.log(error));
    }
  }, [searchValue]);

  useEffect(() => {
    if (placemarkGeometry[0] && placemarkGeometry[1] && mapRef.current) {
      mapRef.current.setCenter(placemarkGeometry, undefined, {
        duration: 750,
        timingFunction: "ease-in",
      });
    }
  }, [placemarkGeometry]);

  const handleInputChange = (e) => {
    if (e.target.value.trim() === "") {
      setGeocodeList([]);
    }
    setFieldValue("address", e.target.value);
    setSearchValue(e.target.value);
  };

  const onGetAddress = (firstGeoObject) => {
    setFieldValue("address", firstGeoObject.label);
  };

  const onMapClick = (e) => {
    let location = e.get("coords");
    setFieldValue("location.lat", location[0]);
    setFieldValue("location.long", location[1]);
    setPlacemarkGeometry(location);
  };

  const headerButtons = (
    <>
      <Button
        icon={CancelIcon}
        size="large"
        shape="outlined"
        color="red"
        borderColor="bordercolor"
        onClick={() => history.push("/home/settings/company?tab=2")}
      >
        {t("cancel")}
      </Button>

      <Button icon={SaveIcon} size="large" type="submit" onClick={onSubmit}>
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
      <p>{params?.id ? t("edit_region") : t("add_region")}</p>
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
              <span className="input-label mb-1">Названия региона</span>
              <div>
                <Input
                  size="large"
                  id="search-map"
                  placeholder="Названия региона"
                  value={values.address}
                  onChange={(e) => handleInputChange(e)}
                />
                {geocodeList.length > 0 && (
                  <RegionDropDown
                    options={geocodeList}
                    setGeocodeList={setGeocodeList}
                    setFieldValue={setFieldValue}
                    setPlacemarkGeometry={setPlacemarkGeometry}
                    values={values}
                  />
                )}
              </div>
            </div>
            <div className="flex mt-4">
              <span className="input-label">{t("status")}</span>
              <Switch
                onChange={() => setFieldValue("is_active", !values.is_active)}
                checked={values.is_active}
                className="ml-1"
              />
            </div>
            <div className="mt-4" style={{ height: 500 }}>
              <YandexMap
                defaultState={
                  params.id
                    ? { center: placemarkGeometry, zoom: 11 }
                    : undefined
                }
                onGetAddress={onGetAddress}
                onMapClick={onMapClick}
                mapRef={mapRef}
                modules={["Placemark", "geocode"]}
              >
                {placemarkGeometry?.length > 0 && (
                  <Placemark
                    geometry={placemarkGeometry.length ? placemarkGeometry : []}
                  />
                )}
              </YandexMap>
            </div>
          </Card>
        </Box>
      </div>
      <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
        {headerButtons}
      </div>
    </div>
  );
};

export default CreateRegion;
