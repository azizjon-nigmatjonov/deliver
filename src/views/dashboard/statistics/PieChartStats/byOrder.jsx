import Card from "components/Card";
import RangePicker from "components/DateTimePicker/RangePicker";
import { DashboardCountIcon } from "constants/icons";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getOrderSource } from "services";
import DashboardPieChart from "./PieChart";

const ByOrder = () => {
  const { t } = useTranslation();
  const [date, setDate] = useState("");
  const [data, setData] = useState();
  const today = moment().startOf("month").format("DD");

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
    getOrderSource(params).then((res) => setData(res));
  }, [date]);

  const makeDate = useMemo(() => {
    let arr = [
      {
        name: t("call.center"),
        value: data?.call_center_count,
        color: "#FFD802",
        percent: data?.call_center_percent,
      },
      {
        name: t("aggregator"),
        value: data?.aggregator_count,
        color: "#F03E3E",
        percent: data?.aggregator_percent,
      },
      {
        name: t("app"),
        value: data?.mobile_app_count,
        color: "#FFA252",
        percent: data?.mobile_app_percent,
      },
      {
        name: t("site"),
        value: data?.web_site_count,
        color: "#84CA85",
        percent: data?.web_site_percent,
      },
      {
        name: t("telegram_bot"),
        value: data?.telegram_bot_count,
        color: "#7048E8",
        percent: data?.telegram_bot_percent,
      },
    ];

    return arr;
  }, [data, t]);

  return (
    <Card
      className="h-full"
      bodyStyle={{ padding: "0px" }}
      title={
        <div
          className="flex items-center gap-2.5"
          style={{ padding: "8px 0px" }}
        >
          <DashboardCountIcon />
          <div className="text-lg font-bold">{t("orders")}</div>
        </div>
      }
    >
      <div className="border-b" style={{ padding: "10px 16px" }}>
        <RangePicker
          style={{ width: "270px" }}
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
      </div>
      <div>
        <DashboardPieChart data={makeDate} count={data?.all} />
      </div>
    </Card>
  );
};

export default ByOrder;
