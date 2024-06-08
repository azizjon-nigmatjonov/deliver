import { useState, useCallback, useEffect } from "react";
import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import { useTranslation } from "react-i18next";
import Gallery from "components/Gallery";
import { getFares, useBranchById } from "services";
import { useParams } from "react-router-dom";
import FullScreenLoader from "components/FullScreenLoader";
import Map from "./Map";
import AsyncSelect from "components/Select/Async";
import MapDropDown from "./MapDropDown";
import ReactInputMask from "react-input-mask";
import { getGeoCodeAddressList } from "services/yandex";
import Switch from "components/Switch";
import PhoneInput from "components/PhoneInput";
import Select from "components/Select";
import GeozoneForm from "views/settings/company/tabs/Geozone/GeozoneForm";
import menuService from "services/v2/catalog/menu";

export default function AboutBranch({
  formik,
  geozonePoints,
  setGeozonePoints,
}) {
  const { t } = useTranslation();
  const params = useParams();
  const [placemarkGeometry, setPlacemarkGeometry] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [geocodeList, setGeocodeList] = useState([]);
  const [open, setOpen] = useState(false);

  const { isFetching } = useBranchById({
    branch_id: params?.id,
    props: {
      enabled: !!params?.id,
      onSuccess: (res) => {
        setGeozonePoints(
          res?.geozone?.points
            ? res?.geozone?.points?.map((locations) => Object.values(locations))
            : [],
        );
        setValues({
          name: res?.name,
          phone: res?.phone,
          address: res?.address,
          image: res?.image,
          geozone_id: res?.geozone?.id,
          location: res?.location,
          work_hour_start: res?.work_hour_start,
          work_hour_end: res?.work_hour_end,
          orders_limit: res?.orders_limit,
          fare_id: {
            label: res?.fare.name,
            value: res?.fare.id,
          },
          tg_chat_id: res?.tg_chat_id,
          to_address: res?.to_address,
          destination: res?.destination,
          menu: res?.menu_id
            ? {
                label: res?.menu_title,
                value: res?.menu_id,
              }
            : "",
          is_active: res?.is_active,
          iiko_id: res?.iiko_id,
          iiko_terminal_id: res?.iiko_terminal_id,
          jowi_id: res?.jowi_id,
          crm:
            res?.crm === "iiko"
              ? {
                  label: "IIKO",
                  value: "IIKO",
                }
              : res?.crm === "jowi"
              ? {
                  label: "JOWI",
                  value: "JOWI",
                }
              : res?.crm === "rkeeper"
              ? {
                  label: "R-Keeper",
                  value: "R-Keeper",
                }
              : res?.crm === "poster"
              ? {
                  label: "Poster",
                  value: "Poster",
                }
              : res?.crm === ""
              ? {
                  label: "DELEVER",
                  value: "DELEVER",
                }
              : "",
        });
        setPlacemarkGeometry([res?.location?.lat, res?.location?.long]);
      },
    },
  });

  const { values, handleChange, setFieldValue, setValues } = formik;

  useEffect(() => {
    if (searchValue) {
      getGeoCodeAddressList(searchValue)
        .then((res) =>
          setGeocodeList(
            res?.data?.response?.GeoObjectCollection?.featureMember?.map(
              (res) => ({
                label: res?.GeoObject.name,
                description: res?.GeoObject.description,
                location: res?.GeoObject.Point,
              }),
            ) ?? [],
          ),
        )
        .catch((error) => console.log(error));
    }
  }, [searchValue]);

  const loadFares = useCallback((input, cb) => {
    getFares({ search: input })
      .then((res) => {
        let fares = res?.fares?.map((fare) => ({
          label: fare.name,
          value: fare.id,
        }));
        cb(fares);
      })
      .catch((err) => console.log(err));
  }, []);

  const loadMenus = useCallback((input, cb) => {
    menuService.getList({ search: input }).then((res) => {
      let menus = res?.menus.map((menu) => ({
        label: menu.name,
        value: menu.id,
      }));
      cb(menus);
    });
  }, []);

  const handleChangeSearch = (e) => {
    if (e.target.value.trim() === "") {
      setGeocodeList([]);
    }
    setFieldValue("address", e.target.value);
    setSearchValue(e.target.value);
  };

  if (isFetching) return <FullScreenLoader />;

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Card title={t("general.information")}>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <Form.Item formik={formik} name="image">
              <div className="w-full h-full flex mt-6 items-center flex-col">
                <Gallery
                  rounded
                  width={120}
                  height={120}
                  gallery={
                    values.image
                      ? [
                          values?.image?.includes(
                            process.env.REACT_APP_MINIO_URL,
                          )
                            ? values?.image?.slice(
                                values.image.indexOf(
                                  process.env.REACT_APP_MINIO_URL,
                                ) + process.env.REACT_APP_MINIO_URL.length,
                              )
                            : values?.image,
                        ]
                      : []
                  }
                  setGallery={(elm) => setFieldValue("image", elm[0])}
                  multiple={false}
                  extraTitle="795x400"
                />
              </div>
            </Form.Item>
          </div>

          <div className="col-span-9 flex flex-col gap-4">
            <div className="w-full flex items-center">
              <div className="w-1/4 input-label">
                <span>{t("name")}</span>
              </div>
              <div className="w-3/4">
                <div>
                  <Form.Item formik={formik} name="name">
                    <Input
                      size="large"
                      id="name"
                      placeholder={t("name")}
                      value={values.name}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="w-full flex items-center">
              <div className="w-1/4 input-label">
                <span>{t("phone")}</span>
              </div>
              <div className="w-3/4">
                <div>
                  <Form.Item formik={formik} name="phone">
                    <PhoneInput
                      value={values.phone}
                      onChange={(e) =>
                        formik.setFieldValue("phone", e.target.value)
                      }
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="flex w-full items-center">
              <div className="w-1/4 input-label">
                <label>{t("address")}</label>
              </div>
              <div className="w-3/4">
                <Form.Item formik={formik} name="address">
                  <Input
                    size="large"
                    id="address"
                    placeholder={t("address")}
                    value={values.address}
                    onChange={(e) => handleChangeSearch(e)}
                    // onFocus={onFocus}
                  />
                </Form.Item>
                {geocodeList.length > 0 && (
                  <MapDropDown
                    options={geocodeList}
                    setFieldValue={setFieldValue}
                    setGeocodeList={setGeocodeList}
                    setPlacemarkGeometry={setPlacemarkGeometry}
                  />
                )}
              </div>
            </div>

            <div className="flex w-full items-center">
              <div className="w-1/4 input-label">
                <label>{t("landmark")}</label>
              </div>
              <div className="w-3/4">
                <Form.Item formik={formik} name="destination">
                  <Input
                    size="large"
                    id="destination"
                    placeholder={t("landmark")}
                    value={values.destination}
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="flex w-full items-center">
              <div className="w-1/4 input-label">
                <label>{t("integration")}</label>
              </div>
              <div className="w-3/4">
                <Form.Item formik={formik} name="crm">
                  <Select
                    height={40}
                    value={values.crm}
                    options={[
                      { label: "IIKO", value: "IIKO" },
                      { label: "JOWI", value: "JOWI" },
                      { label: t("R-Keeper"), value: "R-Keeper" },
                      { label: "Poster", value: "Poster" },
                      { label: t("Delever"), value: "Delever" },
                    ]}
                    onChange={(val) => {
                      setFieldValue("crm", {
                        label: val.value,
                        value: val.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card title={t("settings.branch")}>
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center">
            <div className="w-1/4 input-label">
              <label>{t("orders.limit")}</label>
            </div>
            <div className="w-3/4">
              <Form.Item formik={formik} name="orders_limit">
                <Input
                  id="orders_limit"
                  value={values.orders_limit}
                  onChange={handleChange}
                  className="w-full"
                  placeholder={t("orders.limit")}
                  suffix={t("pcs")}
                />
              </Form.Item>
            </div>
          </div>

          <div className="flex w-full items-center">
            <div className="w-1/4 input-label">
              <label>{t("menu")}</label>
            </div>
            <div className="w-3/4">
              <Form.Item formik={formik} name="menu">
                <AsyncSelect
                  id="menu"
                  loadOptions={loadMenus}
                  defaultOptions
                  isSearchAble
                  isClearable
                  required
                  value={values.menu}
                  onChange={(val) => setFieldValue("menu", val)}
                  className="w-full"
                />
              </Form.Item>
            </div>
          </div>

          <div className="flex w-full items-center">
            <div className="w-1/4 input-label">
              <label>{t("fares")}</label>
            </div>
            <div className="w-3/4">
              <Form.Item formik={formik} name="fare_id">
                <AsyncSelect
                  id="fare_id"
                  loadOptions={loadFares}
                  defaultOptions
                  isSearchAble
                  isClearable
                  required
                  value={values.fare_id}
                  onChange={(val) => {
                    setFieldValue("fare_id", val);
                  }}
                  className="w-full"
                />
              </Form.Item>
            </div>
          </div>

          <div className="flex w-full items-center">
            <div className="w-1/4 input-label">
              <label>{t("tg.chat.id")}</label>
            </div>
            <div className="w-3/4">
              <Form.Item formik={formik} name="tg_chat_id">
                <Input
                  id="tg_chat_id"
                  value={values.tg_chat_id}
                  onChange={handleChange}
                  placeholder={t("tg.chat.id")}
                  className="w-full"
                />
              </Form.Item>
            </div>
          </div>

          <div className="flex w-full items-center">
            <div className="w-1/4 input-label">
              <label>{t("active")}</label>
            </div>
            <div className="w-3/4">
              <Form.Item formik={formik} name="is_active">
                <Switch
                  color="primary"
                  checked={values.is_active}
                  onClick={() => setFieldValue("is_active", !values.is_active)}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </Card>
      <Map
        formik={formik}
        setOpen={setOpen}
        geozonePoints={geozonePoints}
        setGeozonePoints={setGeozonePoints}
        placemarkGeometry={placemarkGeometry}
        setPlacemarkGeometry={setPlacemarkGeometry}
      />
      <GeozoneForm
        open={open}
        id={params?.id}
        formik={formik}
        values={values}
        setFieldValue={setFieldValue}
        setOpen={setOpen}
        geozonePoints={geozonePoints}
        setGeozonePoints={setGeozonePoints}
      />
      <Card title={t("schedule")}>
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center">
            <div className="w-1/4 input-label">
              <label>{t("work_hour_start")}</label>
            </div>
            <div className="w-3/4">
              <Form.Item formik={formik} name="work_hour_start">
                <ReactInputMask
                  id="work_hour_start"
                  maskplaceholder={t("enter.time")}
                  value={values.work_hour_start}
                  mask="99:99"
                  onChange={handleChange}
                  disabled={false}
                >
                  {(inputProps) => (
                    <Input
                      {...inputProps}
                      placeholder={t("enter.time")}
                      onChange={handleChange}
                      disabled={false}
                    />
                  )}
                </ReactInputMask>
              </Form.Item>
            </div>
          </div>

          <div className="flex w-full items-center">
            <div className="w-1/4 input-label">
              <label>{t("work_hour_end")}</label>
            </div>
            <div className="w-3/4">
              <Form.Item formik={formik} name="work_hour_end">
                <ReactInputMask
                  id="work_hour_end"
                  maskplaceholder={t("enter.time")}
                  value={values.work_hour_end}
                  mask="99:99"
                  onChange={handleChange}
                  disabled={false}
                >
                  {(inputProps) => (
                    <Input
                      {...inputProps}
                      placeholder={t("enter.time")}
                      onChange={handleChange}
                      disabled={false}
                    />
                  )}
                </ReactInputMask>
              </Form.Item>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
