import React, { useEffect, useState } from "react";
import Header from "components/Header";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useHistory } from "react-router-dom";
import Filters from "components/Filters";
import RangePicker from "components/DatePicker/RangePicker";
import moment from "moment";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import { getKitchenData } from "services/v2/kitchen";
import { useSelector } from "react-redux";
import KHCard from "./KHCard.jsx/index.jsx";
import { LinearProgress } from "@mui/material";
import HeaderDataWrapper from "views/kitchen/HeaderDataWrapper.jsx";
import Clipboard from "assets/icons/clipboard.svg";
import Search from "components/Search/index.jsx";
import Masonry from "react-smart-masonry";
// import TabLabel from "components/Tab/TabLabel";

const deliveryTypes = {
  0: "delivery",
  1: "self-pickup",
  2: "aggregator",
  3: "",
};

const START_DATE = `${moment().format("YYYY-MM-DD")} 05:00:00`;
const END_DATE = `${moment().add(1, "d").format("YYYY-MM-DD")} 05:00:00`;

const KitchenHistoryOrders = () => {
  const [filters, setFilters] = useState({
    start_date: START_DATE,
    end_date: END_DATE,
    delivery_type: "delivery",
  });
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [kitchenData, setKitchenData] = useState([]);
  const auth = useSelector((state) => state.auth);
  const [search, setSearch] = useState(null);

  useEffect(() => {
    const getData = () => {
      setLoading(true);
      getKitchenData({
        page: 1,
        start_date: filters.start_date,
        end_date: filters.end_date,
        branch_id: auth.branch_id,
        status_ids:
          value !== 3
            ? process.env.REACT_APP_FINISHED_STATUS_ID
            : String([
                process.env.REACT_APP_OPERATOR_CANCELED_STATUS_ID,
                process.env.REACT_APP_OPERATOR_ACCEPTED_STATUS_ID,
              ]),
        delivery_type: filters.delivery_type,
        external_order_id: Number(search),
      })
        .then(setKitchenData)
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    };

    getData();
  }, [filters, value, auth.branch_id, search]);

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);

    setFilters((prev) => ({
      ...prev,
      delivery_type: deliveryTypes[newValue],
    }));
  };

  const handleChangeIndex = (index) => {
    setValue(index);
    setSearch("");
  };

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  const handleRangePicker = (e) => {
    if (e[0] === null) {
      setFilters((old) => ({
        ...old,
        start_date: START_DATE,
        end_date: END_DATE,
      }));
    } else {
      setFilters((old) => ({
        ...old,
        start_date: `${moment(e[0]).format("YYYY-MM-DD")} 05:00:00`,
        end_date: `${moment(e[1]).format("YYYY-MM-DD")} 05:00:00`,
      }));
    }
  };

  return (
    <div>
      <Header
        startAdornment={
          <div className="flex items-center gap-1">
            <ArrowBackIcon
              onClick={() => history.goBack()}
              className="cursor-pointer"
            />
            <p>{t("history.orders")}</p>
          </div>
        }
        endAdornment={
          <HeaderDataWrapper>
            <img src={Clipboard} alt="clipboard" className="mr-1" />

            <p>{kitchenData?.count ?? 0}</p>
          </HeaderDataWrapper>
        }
      />
      <Filters>
        <div className="flex items-center gap-2">
          <Search setSearch={(value) => setSearch(value)} />

          <RangePicker
            placeholder={t("select.date")}
            hideTimePicker
            onChange={(e) => handleRangePicker(e)}
          />
        </div>
      </Filters>
      <Filters>
        <StyledTabs
          value={value}
          onChange={handleChange}
          centered={false}
          aria-label="full width tabs example"
          TabIndicatorProps={{ children: <span className="w-2" /> }}
        >
          <StyledTab
            {...a11yProps(0)}
            style={{ width: "100px" }}
            label={
              // <TabLabel
              //   isActive={0 === value}
              //   count={defineCount(0, ordersCount)}
              // >
              tabLabel(t("delivery"))
              /* </TabLabel> */
            }
          />
          <StyledTab
            label={tabLabel(t("self_pickup"))}
            {...a11yProps(1)}
            style={{ width: "100px" }}
          />
          <StyledTab
            label={tabLabel(t("aggregators"))}
            {...a11yProps(2)}
            style={{ width: "100px" }}
          />
          <StyledTab
            label={tabLabel(t("canceleds"))}
            {...a11yProps(3)}
            style={{ width: "100px" }}
          />
        </StyledTabs>
      </Filters>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction} className="p-4">
          {loading ? (
            <LinearProgress className="mt-2" />
          ) : (
            <Masonry columns={4} gap={10}>
              {kitchenData?.finished_orders?.map((order) => (
                <KHCard order={order} key={order.id} tabIndex={value} />
              ))}
            </Masonry>
          )}
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction} className="p-4">
          {loading ? (
            <LinearProgress className="mt-2" />
          ) : (
            <Masonry columns={4} gap={10}>
              {kitchenData?.finished_orders?.map((order) => (
                <KHCard order={order} key={order.id} tabIndex={value} />
              ))}
            </Masonry>
          )}
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction} className="p-4">
          {loading ? (
            <LinearProgress className="mt-2" />
          ) : (
            <Masonry columns={4} gap={10}>
              {kitchenData?.finished_orders?.map((order) => (
                <KHCard order={order} key={order.id} tabIndex={value} />
              ))}
            </Masonry>
          )}
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction} className="p-4">
          {loading ? (
            <LinearProgress className="mt-2" />
          ) : (
            <Masonry columns={4} gap={10}>
              {kitchenData?.cancelled_orders?.map((order) => (
                <KHCard order={order} key={order.id} tabIndex={value} />
              ))}
            </Masonry>
          )}
        </TabPanel>
      </SwipeableViews>
    </div>
  );
};

export default KitchenHistoryOrders;
