import React, { useEffect, useState } from "react";
import Card from "components/Card";
import { Clusterer, Placemark } from "@pbe/react-yandex-maps";
import { useTranslation } from "react-i18next";
import { getOrderLocations } from "services/dashboard";
import moment from "moment";
import YandexMap from "components/YandexMap";

const MapAnalystics = () => {
  const { t } = useTranslation();
  const [orderLocations, setOrderLocations] = useState();
  const [orderLocationsCount, setOrderLocationsCount] = useState(0);

  useEffect(() => {
    getOrderLocations({
      start_date: `${moment().format("YYYY-MM-DD")} 5:00:00`,
      end_date: `${moment().add(1, "days").format("YYYY-MM-DD")} 5:00:00`,
      limit: 200,
      page: 1,
    }).then((res) => {
      setOrderLocations(res?.orders);
      setOrderLocationsCount(res?.count);
    });
  }, []);

  return (
    <Card
      className="mt-4"
      title={t("map")}
      extra={`${t("count.orders")}: ${orderLocationsCount} `}
      bodyStyle={{ height: 500 }}
    >
      <YandexMap>
        <Clusterer
          options={{
            preset: "islands#invertedBlueClusterIcons",
            groupByCoordinates: false,
          }}
        >
          {orderLocations?.map((item) => (
            <Placemark
              key={item.id}
              geometry={[item?.to_location?.lat, item?.to_location?.long]}
              properties={{
                balloonContentBody: `
                      <div>Имя клиента: ${item.client_name},
                      <br/>
                      Номер телефона клиента: ${item.client_phone_number},
                      <br/>
                      ID заказа: <a href="#/home/orders/${item.id}"> ${item.external_order_id}</a></div>`,
                hintContent: `<div>Имя клиента: ${item.client_name}</div>`,
              }}
            />
          ))}
        </Clusterer>
      </YandexMap>
    </Card>
  );
};
export default MapAnalystics;
