import Card from "components/Card";
import DatePicker from "components/DatePicker";
import { StyledTab } from "components/StyledTabs";
import { StyledTabs } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import { DashboardCountIcon } from "constants/icons";
import yearOfMonth from "constants/year";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SwipeableViews from "react-swipeable-views";
import { getStatistics } from "services";
import { useTheme } from "@mui/material";
import LineChartStats from "../charts/LineChart";

const YearlyMonthlyStatistics = () => {
  // = = = = = = = = = = variables = = = = = = = = = = //
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const [data, setData] = useState();
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [loader, setLoader] = useState(false);

  const totalCountsYear = useMemo(() => {
    const lated = data?.yearly_orders_reports?.reduce(
      (acc, cur) => acc + cur.lated_orders_count,
      0,
    );
    const cancelled = data?.yearly_orders_reports?.reduce(
      (acc, cur) => acc + cur.canceled_orders_count,
      0,
    );
    const self_pickup = data?.yearly_orders_reports?.reduce(
      (acc, cur) => acc + cur.self_pickup_orders_count,
      0,
    );
    const delivery = data?.yearly_orders_reports?.reduce(
      (acc, cur) => acc + cur.delivery_orders_count,
      0,
    );
    const aggregator = data?.yearly_orders_reports?.reduce(
      (acc, cur) => acc + cur.aggregator_orders_count,
      0,
    );
    return {
      left: [
        {
          key: "total",
          title: "Итого",
          count: self_pickup + delivery + aggregator,
          color: "#0e73f6",
        },
        {
          key: "delivery",
          title: "Доставки",
          count: delivery,
          color: "#84CA85",
        },
        {
          key: "self-pickup",
          title: "Самовывоз",
          count: self_pickup,
          color: "#FFD802",
        },
        {
          key: "aggregator",
          title: "Агрегатор",
          count: aggregator,
          color: "#7048E8",
        },
      ],
      right: [
        {
          key: "lated",
          title: "Опоздавших",
          count: lated,
          color: "#FFA252",
        },
        {
          key: "canceled",
          title: "Отмененных",
          count: cancelled,
          color: "#F03E3E",
        },
      ],
    };
  }, [data]);

  const totalCountMonth = useMemo(() => {
    const arr = data?.yearly_orders_reports
      .filter((item) => item.month === moment(month).month() + 1)
      ?.map((item) => {
        return {
          left: [
            {
              key: "total_orders_count",
              title: "Итого",
              count:
                item?.delivery_orders_count +
                item?.self_pickup_orders_count +
                item?.aggregator_orders_count,
              color: "#0e73f6",
            },
            {
              key: "delivery_orders_count",
              title: "Доставки",
              count: item?.delivery_orders_count,
              color: "#84CA85",
            },
            {
              key: "self_pickup_orders_count",
              title: "Самовывоз",
              count: item?.self_pickup_orders_count,
              color: "#FFD802",
            },
            {
              key: "aggregator_orders_count",
              title: "Агрегатор",
              count: item?.aggregator_orders_count,
              color: "#7048E8",
            },
          ],
          right: [
            {
              key: "lated_orders_count",
              title: "Опоздавших",
              count: item?.lated_orders_count,
              color: "#FFA252",
            },
            {
              key: "canceled_orders_count",
              title: "Отмененных",
              count: item?.canceled_orders_count,
              color: "#F03E3E",
            },
          ],
        };
      });

    return arr;
  }, [data, month]);

  // = = = = = = = = = = get statistics request = = = = = = = = = = //
  const getStats = useCallback(() => {
    setLoader(true);
    const params = {
      month: month ? moment(month).month() + 1 : moment().month() + 1,
      year:
        value === 0
          ? month
            ? moment(month).year()
            : moment().year()
          : year
          ? moment(year).year()
          : moment().year(),
    };
    getStatistics(params)
      .then((res) => setData(res))
      .finally(() => setLoader(false));
  }, [month, value, year]);

  // ####################### make data for line chart ####################### //
  const computedData = useMemo(() => {
    const yearly = data?.yearly_orders_reports?.map((item) => ({
      month: t(`${yearOfMonth[item.month - 1]}`),
      lateOrders: item.lated_orders_count,
      canceledOrders: item.canceled_orders_count,
      selfPickupOrders: item.self_pickup_orders_count,
      deliveryOrders: item.delivery_orders_count,
      aggregatorOrders: item.aggregator_orders_count,
    }));
    const monthly = data?.monthly_orders_reports?.map((item) => ({
      day: item.day,
      lateOrders: item.lated_orders_count,
      canceledOrders: item.canceled_orders_count,
      selfPickupOrders: item.self_pickup_orders_count,
      deliveryOrders: item.delivery_orders_count,
      aggregatorOrders: item.aggregator_orders_count,
    }));
    return { yearly, monthly };
  }, [data, t]);
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
  useEffect(() => {
    getStats();
  }, [year, month, getStats]);

  return (
    <div id="statsDashboard">
      <Card
        style={{ marginTop: "16px" }}
        title={
          <div
            className="flex items-center gap-2.5"
            style={{ padding: "8px 0px" }}
          >
            <DashboardCountIcon />
            <div className="text-lg font-bold">{t("statistics")}</div>
          </div>
        }
        extra={
          value === 1 ? (
            <DatePicker
              mode="year"
              // isMonth={true}
              hideTimePicker
              hideTimeBlock
              dateformat="YYYY"
              defaultValue={moment()}
              onChange={(e) => setYear(e)}
              inputDateClear
              // value={moment().year()}
            />
          ) : (
            <DatePicker
              mode="month"
              // isMonth={true}
              hideTimePicker
              hideTimeBlock
              dateformat="MM.YYYY"
              defaultValue={moment()}
              onChange={(e) => setMonth(e)}
              inputDateClear
            />
          )
        }
      >
        <div style={{ position: "relative" }}>
          <StyledTabs
            value={value}
            onChange={handleChange}
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab label={tabLabel(t("month"))} {...a11yProps(0)} />
            <StyledTab label={tabLabel(t("year"))} {...a11yProps(1)} />
          </StyledTabs>

          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <LineChartStats
                total={
                  computedData?.monthly?.deliveryOrders +
                  computedData?.monthly?.selfPickupOrders +
                  computedData?.monthly?.aggregatorOrders
                }
                data={computedData?.monthly}
                type={"month"}
                date={
                  month ? moment(month).format("MMMM") : moment().format("MMMM")
                }
                loader={loader}
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <LineChartStats
                data={computedData?.yearly}
                total={
                  computedData?.monthly?.deliveryOrders +
                  computedData?.monthly?.selfPickupOrders +
                  computedData?.monthly?.aggregatorOrders
                }
                type={"year"}
                date={
                  value === 1
                    ? moment(month).year()
                    : year
                    ? moment(year).year()
                    : moment().year()
                }
                loader={loader}
              />
            </TabPanel>
          </SwipeableViews>
          <div>
            <div
              className="mt-4 flex"
              style={{ borderTop: "1px solid #F3F3F3", gap: "100px" }}
            >
              {value === 1 ? (
                <>
                  <div className="flex flex-col gap-4">
                    {totalCountsYear?.left?.map((item) => (
                      <div
                        className="flex items-center gap-2.5 mt-1"
                        key={item?.key}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            background: item.color,
                            borderRadius: "4px",
                          }}
                        />
                        <div>
                          {item?.title}: {item?.count}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    {totalCountsYear?.right?.map((item) => (
                      <div
                        className="flex items-center gap-2.5 mt-1"
                        key={item?.key}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            background: item.color,
                            borderRadius: "4px",
                          }}
                        />
                        <div>
                          {item?.title}: {item?.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-4">
                    {totalCountMonth &&
                      totalCountMonth[0]?.left?.map((item) => (
                        <div
                          className="flex items-center gap-2.5 mt-1"
                          key={item?.key}
                        >
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              background: item.color,
                              borderRadius: "4px",
                            }}
                          />
                          <div>
                            {item?.title}: {item?.count}
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    {totalCountMonth &&
                      totalCountMonth[0]?.right?.map((item) => (
                        <div
                          className="flex items-center gap-2.5 mt-1"
                          key={item?.key}
                        >
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              background: item.color,
                              borderRadius: "4px",
                            }}
                          />
                          <div>
                            {item?.title}: {item?.count}
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default YearlyMonthlyStatistics;
