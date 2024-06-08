import Card from "components/Card";
import {
  DashboardCountIcon,
  PeopleIcon,
  PersonInDashboard,
  RFMSettingsIcon,
} from "constants/icons";
import { useTranslation } from "react-i18next";
import { StyledTab } from "components/StyledTabs";
import { StyledTabs } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@mui/material";
import { dashboardLtv, useRFM } from "services";
import SwipeableViews from "react-swipeable-views";
import RFMTable from "./RFMTable";
import RFMSettings from "./RFMsettings";
import Header from "components/Header";
import MonthPicker from "components/MonthPicker";
import moment from "moment";
import CountUp from "react-countup";
import ClientPieChartDashboard from "views/dashboard/charts/ClientPieChart";
import "../../dashboard.scss";

const CustomerStats = () => {
  // #################### variables #################### //
  const [value, setValue] = useState(0);
  const [xy, setXY] = useState({ x: "M", y: "F" });
  const [modal, setModal] = useState(false);
  const [rangeValue, setRangeValue] = useState({
    from: {
      year: moment().year(),
      month: moment().subtract(1, "month").format("MM"),
    },
    to: {
      year: moment().year(),
      month: moment().month() + 1,
    },
  });
  const [LTVstats, setLTVstats] = useState({});
  const [ltvDate, setLtvDate] = useState();

  const { t } = useTranslation();
  const theme = useTheme();
  const pickRangeRef = useRef(null);
  // = = = = = = = = = = function for tab = = = = = = = = = = //
  const handleChange = (event, newValue) => {
    const inner = event.target.innerText.split("");
    setXY({ x: inner[0], y: inner[2] });
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

  //  #################### get RFM request #################### //

  const { data } = useRFM({
    params: {
      x: xy?.x,
      y: xy?.y,
    },
    props: {
      enabled: true,
    },
  });

  const makeData = useMemo(() => {
    let arr = [
      {
        key: "x1y3",
        percent: data?.x1y3.percent,
        client_count: data?.x1y3.client_count,
        client_total_sum: data?.x1y3.client_total_sum,
      },
      {
        key: "x2y3",
        percent: data?.x2y3.percent,
        client_count: data?.x2y3.client_count,
        client_total_sum: data?.x2y3.client_total_sum,
      },
      {
        key: "x3y3",
        percent: data?.x3y3.percent,
        client_count: data?.x3y3.client_count,
        client_total_sum: data?.x3y3.client_total_sum,
      },
      {
        key: "x1y2",
        percent: data?.x1y2.percent,
        client_count: data?.x1y2.client_count,
        client_total_sum: data?.x1y2.client_total_sum,
      },
      {
        key: "x2y2",
        percent: data?.x2y2.percent,
        client_count: data?.x2y2.client_count,
        client_total_sum: data?.x2y2.client_total_sum,
      },
      {
        key: "x3y2",
        percent: data?.x3y2.percent,
        client_count: data?.x3y2.client_count,
        client_total_sum: data?.x3y2.client_total_sum,
      },
      {
        key: "x1y1",
        percent: data?.x1y1.percent,
        client_count: data?.x1y1.client_count,
        client_total_sum: data?.x1y1.client_total_sum,
      },
      {
        key: "x2y1",
        percent: data?.x2y1.percent,
        client_count: data?.x2y1.client_count,
        client_total_sum: data?.x2y1.client_total_sum,
      },
      {
        key: "x3y1",
        percent: data?.x3y1.percent,
        client_count: data?.x3y1.client_count,
        client_total_sum: data?.x3y1.client_total_sum,
      },
    ];

    return arr;
  }, [data]);

  const computedLTV = useMemo(() => {
    return {
      leftSide: {
        client: {
          title: t("clients"),
          icon: <PeopleIcon />,
          count: LTVstats?.all_customers_count,
        },
        todayOrderedClient: {
          title: t("clients"),
          icon: <PeopleIcon />,
          count: LTVstats?.today_ordered_customers_count,
        },
        newClient: {
          title: t("new.clients"),
          icon: <PersonInDashboard />,
          count: LTVstats?.today_registered_customers_count,
        },
        newClientOrdered: {
          title: t("new.clients"),
          icon: <PersonInDashboard />,
          count: LTVstats?.today_registered_and_ordered_customers_count,
        },
      },
      rightSide: [
        {
          title: t("avg_basket_size"),
          count: LTVstats?.avg_basket_size?.toFixed(2),
          extra: null,
        },
        {
          title: t("order.frequency"),
          count: LTVstats?.order_frequency,
          extra: "",
        },
        {
          title: t("client.value"),
          count: LTVstats?.customer_value,
          extra: t("uzb.sum"),
        },
        {
          title: t("LTV"),
          count: LTVstats?.ltv,
          extra: t("uzb.sum"),
        },
      ],
    };
  }, [LTVstats, t]);

  useEffect(() => {
    const params = {
      from_date: ltvDate
        ? ltvDate?.from_date
        : moment().subtract(1, "month").format("YYYY-MM"),
      to_date: ltvDate ? ltvDate?.to_date : moment().format("YYYY-MM"),
    };
    dashboardLtv(params).then((res) => setLTVstats(res));
  }, [ltvDate]);
  const totalSum =
    computedLTV?.leftSide?.todayOrderedClient?.count +
    computedLTV?.leftSide?.newClientOrdered?.count;

  const dataPieChart = [
    {
      key: "customers_who_ordered",
      name: "Заказавшие клиенты",
      value: computedLTV?.leftSide?.todayOrderedClient?.count,
      color: "#84CA85",
      percent:
        Math.round(
          (computedLTV?.leftSide?.todayOrderedClient?.count / totalSum) * 100,
        ) || "",
    },
    {
      key: "ordered_customers_who_signed_up_today",
      name: "Заказавшие клиенты, которые сегодня зарегистрировались",
      value: computedLTV?.leftSide?.newClientOrdered?.count,
      color: "#FFD802",
      percent:
        Math.round(
          (computedLTV?.leftSide?.newClientOrdered?.count / totalSum) * 100,
        ) || "",
    },
  ];

  const handleRangeDissmis = (value) => {
    console.log(value);
    setRangeValue({
      from: {
        year: value.from.month ? value.from.year : 2023,
        month: value.from.month
          ? value.from.month
          : moment().subtract(1, "month").format("MM"),
      },
      to: { year: value.to.year, month: value.to.month },
    });
    setLtvDate({
      from_date: `${value.from.month ? value.from.year : 2023}-${
        value.from.month
          ? value.from.month
          : moment().subtract(1, "month").format("MM")
      }`,
      to_date: `${value.to.year}-${value.to.month}`,
    });
  };

  return (
    <>
      <Header title={t("clients")} />
      <div className="p-4 grid grid-cols-1 gap-4">
        <div className="bg-white rounded-md p-5 flex items-center justify-between">
          <div
            className="client-block w-1/5"
            style={{
              borderRight: "1px solid #F3F5F8",
              paddingRight: "25px",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="icon">{computedLTV.leftSide.client.icon}</div>
              <div>
                <div className="client-title">
                  {computedLTV.leftSide.client.title}
                </div>
                <div className="client-count">
                  <CountUp
                    end={computedLTV.leftSide.client.count}
                    duration={1}
                    separator=" "
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="icon">{computedLTV.leftSide.newClient.icon}</div>
              <div>
                <div className="client-title">
                  {computedLTV.leftSide.newClient.title}
                </div>
                <div className="client-count">
                  <CountUp
                    end={computedLTV.leftSide.newClient.count}
                    duration={1}
                    separator=" "
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ############################# client pie chart section ############################# */}

          <ClientPieChartDashboard data={dataPieChart} />
          <div className="flex gap-5 flex-col">
            {dataPieChart?.map((item) => (
              <div className="flex w-full gap-2 items-center" key={item.key}>
                <div
                  style={{
                    background: item.color,
                    width: "32px",
                    height: "32px",
                    borderRadius: "4px",
                  }}
                />

                <div
                  style={{
                    fontSize: "14px",
                    width: "90%",
                    fontWeight: "500",
                  }}
                >
                  {item.name}: {item.value} ({item?.percent}%)
                </div>
              </div>
            ))}
          </div>
        </div>
        <Card
          extra={
            <MonthPicker
              value={rangeValue}
              pickRangeRef={pickRangeRef}
              handleRangeDissmis={handleRangeDissmis}
            />
          }
        >
          <div className="flex justify-between gap-4">
            {computedLTV?.rightSide?.map((item) => (
              <div
                key={item?.title + item?.count}
                className="bg-white rounded-md px-2 w-full flex items-center justify-center border py-4"
              >
                <div className="client-block text-center">
                  <div className="client-title mb-2">{item.title}</div>
                  <div className="client-count">
                    {/* {item.title === "Частота заказов" || item.extra === null ? ( */}
                    {item.count}
                    {/* ) : (
                      <CountUp end={item.count} duration={1} separator=" " />
                    )} */}{" "}
                    {item.extra}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card
          title={
            <>
              <div
                className="flex items-center gap-2.5"
                style={{ padding: "8px 0px" }}
              >
                <DashboardCountIcon />
                <div className="text-lg font-bold">{t("RFM")}</div>
              </div>
            </>
          }
          extra={
            <div className="flex items-center">
              <StyledTabs
                value={value}
                onChange={handleChange}
                centered={false}
                aria-label="full width tabs example"
                TabIndicatorProps={{ children: <span className="w-2" /> }}
              >
                <StyledTab label={tabLabel("M-F")} {...a11yProps(0)} />
                <StyledTab label={tabLabel("R-M")} {...a11yProps(1)} />
                <StyledTab label={tabLabel("R-F")} {...a11yProps(2)} />
              </StyledTabs>
              <div onClick={() => setModal(true)} className="cursor-pointer">
                <RFMSettingsIcon />
              </div>
            </div>
          }
        >
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <RFMTable
                y={["Частые заказы", "Средние заказы", "Редкие заказы"]}
                x={["", "Маленькая сумма", "Средняя сумма", "Большая сумма"]}
                data={makeData}
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <RFMTable
                y={["Большая сумма", "Средняя сумма", "Маленькая сумма"]}
                x={["", "Давние", "Средней давности", "Недавние"]}
                data={makeData}
              />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <RFMTable
                y={["Частые заказы", "Средние заказы", "Редкие заказы"]}
                x={["", "Давние", "Средней давности", "Недавние"]}
                data={makeData}
              />
            </TabPanel>
          </SwipeableViews>

          <RFMSettings modal={modal} setModal={setModal} />
        </Card>
      </div>
    </>
  );
};

export default CustomerStats;
