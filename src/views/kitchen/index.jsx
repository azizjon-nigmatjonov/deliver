import Header from "components/Header";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getKitchenData } from "services/v2/kitchen";
import { kitchenTabData } from "utils/kitchenUtils";
import { createContext } from "react";
import { useSelector } from "react-redux";
import KitchenProducts from "./KitchenProducts";
import HeaderDatas from "./HeaderDatas";
import { getBranchCouriers } from "services";
import UPhoneWrapper from "components/UPhoneWrapper";

export const KitchenContext = createContext(null);

const Kitchen = () => {
  const { t } = useTranslation();
  const [kitchenData, setKitchenData] = useState({});
  const [loading, setLoading] = useState(true);
  const auth = useSelector((state) => state.auth);
  const [courier, setCourier] = useState(null);

  const getData = useCallback(() => {
    setLoading(true);
    getKitchenData({
      page: 1,
      branch_id: auth.branch_id,
      start_date: moment().format("YYYY-MM-DD") + " 05:00:00",
      end_date: moment().add(1, "d").format("YYYY-MM-DD") + " 05:00:00",
    })
      .then((res) => {
        setKitchenData(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [auth.branch_id]);

  useEffect(() => {
    getData();
    let interval = null;
    interval = setInterval(() => {
      getData();
    }, 15000);
    getBranchCouriers(auth.branch_id);
    return () => clearInterval(interval);
  }, [getData, auth.branch_id]);

  const loadBranchCouriers = useCallback(
    (input, cb) => {
      getBranchCouriers(auth.branch_id, {
        page: 1,
        limit: 10,
        search: input,
      })
        .then((response) => {
          let couriers = response?.couriers?.map((el) => ({
            label: (
              <UPhoneWrapper
                header={false}
                type="user"
                name={`${el.first_name} ${el.last_name}`}
                phone={el.phone}
                className="mb-4"
              />
            ),
            name: `${el.first_name} ${el.last_name}`,
            value: el.id,
            phone: el.phone,
          }));
          cb(couriers);
        })
        .catch((error) => console.log(error));
    },
    [auth.branch_id],
  );

  return (
    <KitchenContext.Provider
      value={{
        getData,
        loading,
        auth,
        loadBranchCouriers,
        courier,
        setCourier,
      }}
    >
      <div className="w-full">
        <Header
          title={`${t("orders")} ${auth?.branch_name ? auth?.branch_name : ""}`}
          endAdornment={<HeaderDatas kitchenData={kitchenData} />}
        />
        <KitchenProducts
          kitchenData={kitchenData}
          kitchenTabData={kitchenTabData}
        />
        <div className="bt-4"></div>
      </div>
    </KitchenContext.Provider>
  );
};

export default Kitchen;
