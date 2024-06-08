import Card from "components/Card";
import RangePicker from "components/DateTimePicker/RangePicker";
import Async from "components/Select/Async";
import { DashboardCountIcon } from "constants/icons";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import CountUp from "react-countup";
import { useTranslation } from "react-i18next";
import { dashboardCounter, getBranches } from "services";
import SaleStats from "./statistics/SaleStats";
import YearlyMonthlyStatistics from "./statistics/YearlyMonthlyStats";
import MapAnalystics from "./statistics/MapAnalystics";
import Header from "components/Header";
import PieChartStatistics from "./statistics/PieChartStats";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import "./dashboard.scss";

const OrderStats = () => {
  const [topCounters, setTopCounters] = useState({});
  const [date, setDate] = useState("");
  const [branch, setBranch] = useState("");

  const theme = useTheme();
  const today = moment().startOf("month").format("DD");
  const { t } = useTranslation();

  const computedWidgetsData = useMemo(() => {
    return [
      {
        title: "Время доставки",
        icon: <TimerRoundedIcon color="primary" fontSize="large" />,
        number: topCounters?.average_delivery_time,
        extra: "минут",
        id: "delivery_time",
      },
      {
        title: "Средний чек",
        icon: <AttachMoneyRoundedIcon color="primary" fontSize="large" />,
        number: topCounters?.average_cheque,
        extra: "сум",
        id: "average_bill",
      },
      {
        title: "Общая сумма заказов",
        icon: <FunctionsRoundedIcon color="primary" fontSize="large" />,
        number: topCounters?.total_sum,
        extra: "сум",
        id: "total_sum",
      },
      {
        title: "Количество заказов",
        icon: <ShoppingCartRoundedIcon color="primary" fontSize="large" />,
        number: topCounters?.orders_count,
        extra: "",
        id: "orders_count",
      },
    ];
  }, [topCounters]);

  useEffect(() => {
    const getCounts = () => {
      const params = {
        from_date: date
          ? moment(date[0]).format("YYYY-MM-DD")
          : moment().startOf("month").format("YYYY-MM-DD"),
        to_date: date
          ? moment(date[1]).format("YYYY-MM-DD")
          : today === "01"
          ? moment().add(1, "days").format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
        branch_id: branch?.value,
      };
      dashboardCounter(params).then((res) => setTopCounters(res));
    };
    getCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, branch]);

  const loadBranches = useCallback((inputValue, callback) => {
    getBranches({ page: 1, limit: 20, search: inputValue })
      .then((response) => {
        let branches = response?.branches?.map((branch) => ({
          label: branch.name,
          value: branch.id,
        }));
        callback(branches);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Header title={t("orders")} />
      <div className="p-4">
        <Card
          title={
            <div
              className="flex items-center gap-2.5"
              style={{ padding: "14px 0px" }}
            >
              <DashboardCountIcon />
              <div className="text-lg font-bold"> {t("counter")} </div>
            </div>
          }
          extra={
            <div className="flex ml-2">
              <Async
                className="mr-4"
                id="branch"
                loadOptions={loadBranches}
                defaultOptions
                isClearable
                placeholder={t("branch")}
                onChange={(e) => setBranch(e)}
              />

              <RangePicker
                hideTimePicker
                dateValue={[
                  date ? moment(date[0]) : moment().startOf("month"),
                  date ? moment(date[1]) : moment(),
                ]}
                onChange={(e) =>
                  setDate(
                    e[0] === null && e[1] === null
                      ? [moment().startOf("month"), moment()]
                      : e,
                  )
                }
              />
            </div>
          }
        >
          <Grid container spacing={1}>
            {computedWidgetsData?.map((item) => (
              <Grid item xs={12} md={6} lg={3} key={item.id}>
                <div
                  className="w-full flex items-center justify-between gap-1 rounded-md p-6"
                  style={{ border: "1px solid #EBEDEE" }}
                >
                  <div className="info-block">
                    <Typography
                      sx={{ color: theme.palette.primary.main }}
                      fontWeight={700}
                      className="flex gap-1"
                      variant="h5"
                    >
                      {/* <CountUp end={item.number} duration={1} separator=" " /> */}
                      {item.number} {item.extra}
                    </Typography>
                    <Typography sx={{ color: "#6e8bb7" }} variant="body2">
                      {item.title ?? "---"}
                    </Typography>
                  </div>

                  <div className="icon-block">{item.icon}</div>
                </div>
              </Grid>
            ))}
          </Grid>
          <div className="w-full flex flex-wrap mb-5 gap-4 Widgets"></div>
        </Card>
        <SaleStats />
        <YearlyMonthlyStatistics />
        <PieChartStatistics />
        <MapAnalystics />
      </div>
    </>
  );
};

export default OrderStats;
