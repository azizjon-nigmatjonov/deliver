import React, { useCallback, useEffect, useState } from "react";
import Header from "components/Header";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Filters from "components/Filters";
import moment from "moment";
import KHCard from "./KCCard/index.jsx";
import HeaderDataWrapper from "views/kitchen/HeaderDataWrapper.jsx";
import DatePicker from "components/DatePicker/index.jsx";
import { ArrowBack, Assignment } from "@mui/icons-material";
import AsyncSelect from "components/Select/Async";
import Search from "components/Search/index.jsx";
import { getBranchCouriers, getCourierTypes } from "services";
import { useSelector } from "react-redux";
import Pagination from "components/Pagination/index.jsx";

const START_DATE = `${moment().format("YYYY-MM-DD")} 05:00:00`;
const END_DATE = `${moment().add(1, "d").format("YYYY-MM-DD")} 05:00:00`;

const KitchenHistoryOrders = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { branch_id } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [couriersData, setCouriersData] = useState(null);
  const [filters, setFilters] = useState({
    start_date: START_DATE,
    end_date: END_DATE,
    search: "",
    courier_type_id: "",
  });

  // Get all branch couriers
  useEffect(() => {
    setLoading(true);
    getBranchCouriers(branch_id, {
      ...filters,
      courier_type_id: filters?.courier_type_id,
      page: currentPage,
      limit: 12,
    })
      .then(setCouriersData)
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [filters, branch_id, currentPage]);

  const handleDatePicker = (e) => {
    setFilters((prev) => ({
      ...prev,
      start_date: `${moment(e).format("YYYY-MM-DD")} 05:00:00`,
      end_date: `${moment(e).add(1, "d").format("YYYY-MM-DD")} 05:00:00`,
    }));
  };

  const loadCourierTypes = useCallback((inputValue, callback) => {
    getCourierTypes({
      search: inputValue,
      page: 1,
      limit: 10,
    })
      .then((res) => {
        let courier_types = res?.courier_type?.map((type) => ({
          label: type.name,
          value: type.id,
        }));
        callback(courier_types);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header
        startAdornment={
          <div className="flex items-center gap-1 font-semibold text-xl">
            <ArrowBack
              onClick={() => history.goBack()}
              className="cursor-pointer"
            />
            <p>{t("couriers")}</p>
          </div>
        }
      />
      <Filters
        extra={
          <HeaderDataWrapper>
            <Assignment style={{ color: "var(--primary-color)" }} />
            <p>Всего: {couriersData?.count ?? 0}</p>
          </HeaderDataWrapper>
        }
        childrenClassName="flex gap-3 py-4"
      >
        <Search
          placeholder={t("Поиск по имени, номеру телефона")}
          setSearch={(value) =>
            setFilters((prev) => ({ ...prev, search: value }))
          }
        />
        <DatePicker
          isMonth={true}
          hideTimePicker
          hideTimeBlock
          dateformat="DD.MM.YYYY"
          defaultValue={moment()}
          onChange={handleDatePicker}
          inputDateClear
          style={{ width: "152px" }}
        />
        <AsyncSelect
          defaultOptions
          isSearchable
          loadOptions={loadCourierTypes}
          value={filters.courier_type_id}
          placeholder={t("courier.type")}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, courier_type_id: value }))
          }
        />
      </Filters>
      <div className="flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-4 w-full gap-2 p-2">
          {!loading &&
            couriersData?.couriers?.map((item, idx) => (
              <KHCard
                data={item}
                key={item.id + 1}
                animationDelay={`${idx * 50}ms`}
                date={{
                  start_date: filters.start_date,
                  end_date: filters.end_date,
                }}
              />
            ))}
        </div>
        <div className="sticky bottom-0 flex justify-end items-center w-full bg-white px-4 py-2">
          <Pagination
            title={t("general.count")}
            count={couriersData?.count}
            onChange={(pageNumber) => setCurrentPage(pageNumber)}
            limit={12}
            noLimitChange
          />
        </div>
      </div>
    </div>
  );
};

export default KitchenHistoryOrders;
