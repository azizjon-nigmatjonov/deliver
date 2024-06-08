import React, { useEffect, useRef, useState } from "react";
import { apikey } from "constants/mapDefaults";
import { Clusterer, Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { getOrderLocations } from "services/dashboard";
function MapOrderReports({ tabValue, dateValue }) {
  const [data, setData] = useState();
  const yandexMapRef = useRef();
  useEffect(() => {
    if (tabValue === 2) {
      getOrderLocations({
        start_date: dateValue.custom_start_date,
        end_date: dateValue.custom_end_date,
        limit: 200,
        page: 1,
      }).then((res) => {
        setData(res?.orders);
      });
    }
  }, [dateValue, tabValue]);
  return (
    <div className="m-4">
      <div className="flex">
        <div className="w-full ml-4">
          <div className="w-full h-full mt-4">
            <YMaps
              ref={yandexMapRef}
              query={{ apikey, lang: "ru_RU", load: "package.full" }}
            >
              <Map
                width="100%"
                height="50vh"
                defaultState={{
                  center: [data?.to_location?.lat, data?.to_location?.long],
                  zoom: 16,
                  controls: ["fullscreenControl"],
                }}
                state={{ center: [41.31647, 69.248738], zoom: 12 }}
              >
                <Clusterer
                  options={{
                    preset: "islands#invertedBlueClusterIcons",
                    groupByCoordinates: false,
                  }}
                >
                  {data?.map((item) => (
                    <Placemark
                      geometry={[
                        item?.to_location?.lat,
                        item?.to_location?.long,
                      ]}
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
              </Map>
            </YMaps>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MapOrderReports;
