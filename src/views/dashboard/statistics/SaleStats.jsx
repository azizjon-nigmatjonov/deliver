import Card from "components/Card";
import RangePicker from "components/DateTimePicker/RangePicker";
import { StyledTab } from "components/StyledTabs";
import { StyledTabs } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import { DashboardCountIcon } from "constants/icons";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SwipeableViews from "react-swipeable-views";
import { getSalePipline } from "services";
import HorizontalBarChart from "../charts/HorizontalBarChart";
import { useTheme } from "@mui/material";

const SaleStats = () => {
  // = = = = = = = = = = variables = = = = = = = = = = //
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const theme = useTheme();
  const [latedOrderVisible, setLatedOrderVisibile] = useState(false);
  const [reasonsVisible, setReasonsVisible] = useState(false);
  const [getStats, setGetStats] = useState();
  const [totalCounts, setTotalCount] = useState();
  const [date, setDate] = useState("");
  const today = moment().startOf("month").format("DD");

  // ################## show statistics based on tab ################## //
  const tabData = useMemo(() => {
    if (value === 0) return getStats?.delivery_statics;
    else if (value === 1) return getStats?.self_pickup_statics;
    else if (value === 2) return getStats?.aggregator_statics;
  }, [value, getStats]);

  // ################## make cancelled reason array if it exists ################## //
  const canceledReasons = tabData?.canceled_reasons
    ? tabData?.canceled_reasons?.map((item, index) => ({
        name: `${item.reason}`,
        [`${item.reason}`]: item.percent,
        color: "orange",
        count: item.count,
      }))
    : [];

  const serverCanceled = useMemo(() => {
    let arr = [
      ...canceledReasons,
      {
        name:
          tabData?.server_canceled_count === 0
            ? "Сервер отменил 0"
            : "Сервер отменил",
        count: tabData?.server_canceled_count,
        [`Сервер отменил`]: tabData?.server_canceled_percent,
        color: "orange",
      },
      {
        name:
          tabData?.vendor_canceled_count === 0
            ? "Филиал отменил 0 "
            : "Филиал отменил",
        count: tabData?.vendor_canceled_count,
        [`Филиал отменил`]: tabData?.vendor_canceled_percent,
        color: "orange",
      },
    ];
    return arr;
  }, [canceledReasons]);

  // ################## data for bar chart ################## //
  const barchartData = useMemo(() => {
    let data = [];
    if (latedOrderVisible && tabData?.lated_count) {
      if (latedOrderVisible && reasonsVisible) {
        data = [
          {
            name: `Завершён`,
            count: tabData?.finished_count,
            color: "red",
            finishedValue: tabData?.finished_percent,
          },
          {
            name: `Опоздавшие`,
            count: tabData?.lated_count,
            color: "yellow",
            latedValue: tabData?.lated_percent,
          },
          {
            name: `Отменён`,
            count: tabData?.canceled_count,
            color: "green",
            cancelledValue: tabData?.canceled_percent,
          },
          ...serverCanceled,
        ];
      } else {
        data = [
          {
            name: `Завершён`,
            count: tabData?.finished_count,
            color: "red",
            finishedValue: tabData?.finished_percent,
          },
          {
            name: `Опоздавшие`,
            count: tabData?.lated_count,
            color: "yellow",
            latedValue: tabData?.lated_percent,
          },
          {
            name: `Отменён`,
            count: tabData?.canceled_count,
            color: "green",
            cancelledValue: tabData?.canceled_percent,
          },
        ];
      }
    } else if (reasonsVisible) {
      data = [
        {
          name: `Завершён`,
          count: tabData?.finished_count,
          color: "red",
          finishedValue: tabData?.finished_percent,
        },
        {
          name: `Отменён`,
          count: tabData?.canceled_count,
          color: "green",
          cancelledValue: tabData?.canceled_percent,
        },
        ...serverCanceled,
      ];
    } else if (reasonsVisible && latedOrderVisible) {
      data = [
        {
          name: `Завершён`,
          count: tabData?.finished_count,
          color: "red",
          finishedValue: tabData?.finished_percent,
        },
        {
          name: `Опоздавшие`,
          count: tabData?.lated_count,
          color: "yellow",
          latedValue: tabData?.lated_percent,
        },
        {
          name: `Отменён`,
          count: tabData?.canceled_count,
          color: "green",
          cancelledValue: tabData?.canceled_percent,
        },
        ...serverCanceled,
      ];
    } else if (!reasonsVisible && !latedOrderVisible) {
      data = [
        {
          name: `Завершён`,
          finishedValue: tabData?.finished_percent,
          color: "red",
          count: tabData?.finished_count,
        },
        {
          name: `Отменён`,
          count: tabData?.canceled_count,
          color: "green",
          cancelledValue: tabData?.canceled_percent,
        },
      ];
    } else {
      data = [
        {
          name: `Завершён`,
          finishedValue: tabData?.finished_percent,
          color: "red",
          count: tabData?.finished_count,
        },
        {
          name: `Отменён`,
          count: tabData?.canceled_count,
          color: "green",
          cancelledValue: tabData?.canceled_percent,
        },
      ];
    }

    return data;
  }, [latedOrderVisible, reasonsVisible, tabData, serverCanceled]);

  // = = = = = = = = = = function for tab = = = = = = = = = = //
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  // = = = = = = = = = = get pipeline statistics = = = = = = = = = = //
  useEffect(() => {
    const params = {
      from_date: date
        ? moment(date[0]).format("YYYY-MM-DD")
        : moment().startOf("month").format("YYYY-MM-DD"),
      to_date: date
        ? moment(date[1]).format("YYYY-MM-DD")
        : today === "01"
        ? moment().add(1, "days").format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
    };
    getSalePipline(params).then((res) => {
      setGetStats(res);
      setTotalCount({
        deliveryCount: res?.delivery_statics?.all_delivered_count,
        selfPickedCount: res?.self_pickup_statics?.all_self_pickup_count,
        aggregatorCount: res?.aggregator_statics?.all_self_pickup_count,
      });
    });
  }, [date]);

  return (
    <>
      <Card
        style={{ marginTop: "16px" }}
        title={
          <>
            <div
              className="flex items-center gap-2.5"
              style={{ padding: "8px 0px" }}
            >
              <DashboardCountIcon />
              <div className="text-lg font-bold">{t("sales.funnel")}</div>
            </div>
          </>
        }
        extra={
          <>
            <RangePicker
              style={{ width: "272px" }}
              hideTimePicker
              dateValue={[
                date && date[0] !== null
                  ? moment(date[0])
                  : date[0] === null
                  ? moment().startOf("month")
                  : moment().startOf("month"),
                date && date[1] !== null
                  ? moment(date[1])
                  : date[1] === null
                  ? moment()
                  : moment(),
              ]}
              onChange={(e) =>
                setDate(
                  e[0] === null && e[1] === null
                    ? [moment().startOf("month"), moment()]
                    : e,
                )
              }
              placeholder={t("from.date.to.date")}
            />
          </>
        }
      >
        <div>
          <StyledTabs
            value={value}
            onChange={handleChange}
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab
              label={
                <div className="flex">
                  {tabLabel(t("fair"))} {totalCounts?.deliveryCount}
                </div>
              }
              {...a11yProps(0)}
            />
            <StyledTab
              label={
                <div className="flex">
                  {tabLabel(t("self_pickup"))} {totalCounts?.selfPickedCount}
                </div>
              }
              {...a11yProps(1)}
            />
            <StyledTab
              label={
                <div className="flex">
                  {tabLabel(t("aggregator"))} {totalCounts?.aggregatorCount}
                </div>
              }
              {...a11yProps(2)}
            />
            <StyledTab />
          </StyledTabs>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <HorizontalBarChart
                yAxis
                xAxis
                data={barchartData}
                setVisible={setLatedOrderVisibile}
                latedOrderVisible={latedOrderVisible}
                setReasonsVisible={setReasonsVisible}
                reasonsVisible={reasonsVisible}
                type="delivery"
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <HorizontalBarChart
                yAxis
                xAxis
                data={barchartData}
                setVisible={setLatedOrderVisibile}
                latedOrderVisible={latedOrderVisible}
                setReasonsVisible={setReasonsVisible}
                reasonsVisible={reasonsVisible}
                type="self"
              />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <HorizontalBarChart
                yAxis
                xAxis
                data={barchartData}
                setVisible={setLatedOrderVisibile}
                latedOrderVisible={latedOrderVisible}
                setReasonsVisible={setReasonsVisible}
                reasonsVisible={reasonsVisible}
                type="aggregator"
              />
            </TabPanel>
          </SwipeableViews>
        </div>
      </Card>
    </>
  );
};

export default SaleStats;
