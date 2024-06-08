import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "components/Header";
// import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Placemark } from "@pbe/react-yandex-maps";
import { getBranches, getTrackings } from "services";
import { getCouriersInfo } from "services/v2";
import AsyncSelect from "components/Select/Async";
// import Select from "components/Select";
import Switch from "components/Switch";
import {
  ChevronLeftRounded,
  ArrowBackRounded,
  ViewStreamRounded,
} from "@mui/icons-material";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import { withStyles } from "@mui/styles";
import styles from "./styles.module.scss";
import Filters from "components/Filters";
import { Divider, Drawer, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import YandexMap from "components/YandexMap";

const drawerWidth = 340;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  // necessary for content to be below app bar
  minHeight: 55.8,
  justifyContent: "flex-end",
}));

const TrackCourier = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const mapRef = useRef();

  const [ymaps, setYmaps] = useState(null);
  const [branch, setBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [courierTrackings, setCourierTrackings] = useState([]);
  const [couriersInfo, setCouriersInfo] = useState([]);
  const [checkOnlineCouriers, setCheckOnlineCouriers] = useState(true);
  // const [isMapLoading, setIsMapLoading] = useState(true);
  const [templates, setTemplates] = useState([]);

  const headerTitle = useMemo(() => {
    return (
      <div className="flex">
        <ArrowBackRounded
          onClick={() => history.goBack()}
          className="cursor-pointer"
        />
        <p className="ml-3">Отследить курьеров</p>
      </div>
    );
  }, [history]);

  const getCouriers = () => {
    getTrackings({
      branch_id: branch?.value,
      is_online: checkOnlineCouriers,
      is_active: true,
    })
      .then((res) => setCourierTrackings(res?.courier_trackings))
      .catch((error) => console.log(error));
    // .finally(() => setIsMapLoading(false));
  };

  useEffect(() => {
    getCouriers();
    let interval = null;
    interval = setInterval(() => {
      getCouriers();
    }, 15000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch, checkOnlineCouriers]);

  useEffect(() => {
    getCouriersInfo({ page: 1, limit: 50 })
      .then((response) => setCouriersInfo(response?.couriers_info))
      .catch((error) => console.log(error));
  }, []);

  // const StyledTableRow = withStyles((theme) => ({
  //   root: {
  //     "&:nth-of-type(odd)": {
  //       backgroundColor: "#F4F6FA",
  //     },
  //   },
  // }))(TableRow);

  useEffect(() => {
    getBranches({ limit: 200 })
      .then((res) => setBranches(res))
      .catch((e) => console.log(e));
  }, []);

  // const branchOptions = branches?.branches?.map((branch) => ({
  //   label: branch.name,
  //   value: branch.id,
  // }));

  // let isOnline = useMemo(() => {
  //   let is_online = 0;
  //   for (let i = 0; i < courierTrackings.length; i++) {
  //     if (courierTrackings[i]?.courier?.is_online) {
  //       is_online += 1;
  //     }
  //   }
  //   return is_online;
  // }, [courierTrackings.length]);

  // useEffect(() => {
  //   getTrackings({
  //     branch_id: selectedValue.value,
  //     is_online: checkOnlineCouriers,
  //     is_active: true,
  //   })
  //     .then((res) => setCourierTrackings(res?.courier_trackings))
  //     .catch((error) => console.log(error))
  //     .finally(() => setIsMapLoading(false));
  // }, [selectedValue, checkOnlineCouriers]);

  const GetBalloon = (trackCourier) => {
    return `<div class="${styles.map_popup}">
        <b class="${styles.popup_title}">
          ${trackCourier?.courier?.first_name} ${
      trackCourier?.courier?.last_name
    }
        </b>
        <div class="${styles.iconed_items}">
          <img src="images/phone.svg" alt="icon" />
          <span>${trackCourier?.courier?.phone} </span>
        </div>
        <div class="${styles.iconed_items}">
          <img src="images/battery_50.svg" alt="icon" />
          <span>${trackCourier?.tracking?.battery_percent}% </span>
        </div>
        <p class="${styles.popup_items}">Кол-во заказов: ${
      trackCourier?.orders_count
    }</p>
        <div class="${styles.buttons}">
          ${trackCourier?.orders
            ?.map(
              (order) =>
                `<a href="/#/home/orders/${order?.id}?redirect=true">${t(
                  "order",
                )} №${order?.order_num}</a>`,
            )
            .join("\n")}
        </div>
      </div>`;
  };

  const showCar = (orders_count, isOnline) => {
    if (!isOnline) {
      return "images/gray_car.svg";
    } else if (isOnline === true && orders_count === 0) {
      return "images/green_car.svg";
    } else if (isOnline === true && orders_count > 0 && orders_count < 2) {
      return "images/yellow_car.svg";
    } else if (isOnline === true && orders_count >= 2) {
      return "images/red_car.svg";
    } else {
      return "images/gray_car.svg";
    }
  };

  const createTemplateLayoutFactory = (ymaps) => {
    const values = [];

    for (const item of courierTrackings) {
      values.push({
        id: item?.tracking?.courier_id,
        layout: ymaps?.templateLayoutFactory
          ?.createClass(`<div style='width: 300px'><span style='background: ${
          item.courier?.is_online ? "#54e346" : "#bbbfca"
        }; padding: 3px; border-radius: 3px; font-size: 12px; color: ${
          item.courier?.is_online ? "white" : "black"
        }'>
        ${item.courier.first_name + " " + item.courier.last_name}
      </span></div>`),
      });
    }

    setTemplates(values);
  };

  useEffect(() => {
    if (
      courierTrackings.length > 0 &&
      courierTrackings.length !== templates.length
    ) {
      createTemplateLayoutFactory(ymaps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courierTrackings, templates, ymaps]);

  const loadBranches = useCallback((input, cb) => {
    getBranches({ limit: 20, search: input })
      .then((res) => {
        let branches = res?.branches?.map((branch) => ({
          label: `${branch.name} (${branch.real_time_orders_amount})`,
          value: branch.id,
          elm: branch,
        }));
        cb(branches);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="flex flex-col h-screen">
        <Header
          title={headerTitle}
          endAdornment={
            <IconButton onClick={() => setDrawerOpen(true)}>
              <ViewStreamRounded color="primary" />
            </IconButton>
          }
        />
        <Filters
          extra={
            <p className="text-right">
              {checkOnlineCouriers
                ? t("number.of.online.couriers")
                : t("number.of.couriers")}
              : {courierTrackings?.length}
            </p>
          }
        >
          <div className="flex items-center gap-4">
            <AsyncSelect
              isClearable
              loadOptions={loadBranches}
              defaultOptions
              value={branch}
              placeholder={t("branch")}
              onChange={(val) => setBranch(val)}
            />
            <p>Только онлайн курьеры</p>
            <Switch
              color="primary"
              checked={checkOnlineCouriers}
              onClick={() => setCheckOnlineCouriers((prev) => !prev)}
            />
          </div>
        </Filters>
        <div className={styles.map_wrapper}>
          <YandexMap
            onLoad={(ymaps) => {
              setYmaps(ymaps);
              createTemplateLayoutFactory(ymaps); // for first time load
            }}
            mapRef={mapRef}
            controls="largeMapDefaultSet"
            modules={["templateLayoutFactory", "layout.ImageWithContent"]}
          >
            {branches?.branches?.length > 0 &&
              branches?.branches.map((placemark) => (
                <Placemark
                  key={placemark?.id}
                  properties={{
                    iconContent: `${placemark?.name}`,
                  }}
                  options={{
                    preset: "islands#blueStretchyIcon",
                  }}
                  geometry={[placemark?.location.lat, placemark?.location.long]}
                />
              ))}
            {courierTrackings?.length > 0 &&
              courierTrackings.map((trackCourier) => (
                <Placemark
                  key={trackCourier?.tracking?.id}
                  geometry={[
                    trackCourier?.tracking?.location?.lat,
                    trackCourier?.tracking?.location?.long,
                  ]}
                  options={{
                    iconLayout: "default#imageWithContent",
                    iconImageHref: showCar(
                      trackCourier?.orders?.length,
                      trackCourier?.courier?.is_online,
                    ),
                    iconImageSize: [24, 24],
                    iconImageOffset: [-13, -13],
                    iconContentOffset: [-130, -20],
                    balloonMaxHeight: 500,
                    iconContentLayout: templates?.find(
                      ({ id }) => id === trackCourier?.tracking?.courier_id,
                    )?.layout,
                    iconCaptionMaxWidth: "200",
                    hideIconOnBalloonOpen: false,
                  }}
                  properties={{
                    iconContent: `${trackCourier?.courier?.first_name} ${trackCourier?.courier?.last_name}`,
                    // iconCaption: `${trackCourier.courier.first_name} ${trackCourier.courier.last_name}`,
                    balloonMaxHeight: 500,
                    balloonContent: `${GetBalloon(trackCourier)}`,
                    // preset: "islands#circleIconWithCaption",
                  }}
                  modules={["geoObject.addon.balloon"]}
                />
              ))}
          </YandexMap>
        </div>
        {/* <Card title={t("couriers")} className="w-1/2">
          <TableContainer className="w-full rounded-lg border border-lightgray-1">
            <Table area="simple-table">
              <TableHead>
                <TableRow>
                  <TableCell>Тип курьера</TableCell>
                  <TableCell>Онлайн</TableCell>
                  <TableCell>Оффлайн</TableCell>
                  <TableCell>Всего</TableCell>
                  <TableCell>Свободные</TableCell>
                  <TableCell>Занять</TableCell>
                  <TableCell>Выполнено</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {couriersInfo?.map((item) => (
                  <StyledTableRow
                    key={item?.courier_type_id}
                    className="odd:bg-grey-400"
                  >
                    <TableCell>
                      
                    </TableCell>
                    <TableCell>{item?.online}</TableCell>
                    <TableCell>{item?.offline}</TableCell>
                    <TableCell>{item?.total}</TableCell>
                    <TableCell>{item?.free}</TableCell>
                    <TableCell>{item?.busy}</TableCell>
                    <TableCell>{item?.done}</TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card> */}
      </div>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="temporary"
        anchor="right"
        open={isDrawerOpen}
      >
        <DrawerHeader>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <ChevronLeftRounded />
          </IconButton>
        </DrawerHeader>
        <Divider />
        {couriersInfo?.length > 0 ? (
          couriersInfo?.map((courier) => (
            <div key={courier?.courier_type_id} className={styles.courier_card}>
              <p>Тип курьера: {courier?.courier_type_name}</p>
              <p>Онлайн: {courier?.online}</p>
              <p>Оффлайн: {courier?.offline}</p>
              <p>Всего: {courier?.total}</p>
              <p>Свободные: {courier?.free}</p>
              <p>Занять: {courier?.busy}</p>
              <p>Выполнено: {courier?.done}</p>
            </div>
          ))
        ) : (
          <h2 className="text-center mt-8">Нет данных</h2>
        )}
      </Drawer>
    </>
  );
};

export default TrackCourier;
