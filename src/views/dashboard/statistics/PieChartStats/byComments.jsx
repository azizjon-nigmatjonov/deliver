import Card from "components/Card";
import RangePicker from "components/DateTimePicker/RangePicker";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import { DashboardCountIcon } from "constants/icons";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDashboardReview } from "services";
import DashboardPieChart from "./PieChart";

const ByComment = () => {
  const { t } = useTranslation();
  const [date, setDate] = useState("");
  const [data, setData] = useState();
  const [value, setValue] = useState(0);
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
    getDashboardReview(params).then((res) => setData(res));
  }, [date]);

  const makeDate = useMemo(() => {
    let arr = {
      like: [
        {
          name: t("delivery_time"),
          value: data?.like?.delivery_time_count,
          color: "#84CA85",
          percent: data?.like?.delivery_time_percent,
        },
        {
          name: t("operator"),
          value: data?.like?.operator_count,
          color: "#FFA252",
          percent: data?.like?.operator_percent,
        },
        {
          name: t("courier"),
          value: data?.like?.courier_count,
          color: "#7048E8",
          percent: data?.like?.courier_percent,
        },
        {
          name: t("meal"),
          value: data?.like?.meal_count,
          color: "#FFD802",
          percent: data?.like?.meal_percent,
        },
      ],
      disLike: [
        {
          name: t("delivery_time"),
          value: data?.dislike?.delivery_time_count,
          color: "#84CA85",
          percent: data?.dislike?.delivery_time_percent,
        },
        {
          name: t("operator"),
          value: data?.dislike?.operator_count,
          color: "#FFA252",
          percent: data?.dislike?.operator_percent,
        },
        {
          name: t("courier"),
          value: data?.dislike?.courier_count,
          color: "#7048E8",
          percent: data?.dislike?.courier_percent,
        },
        {
          name: t("meal"),
          value: data?.dislike?.meal_count,
          color: "#FFD802",
          percent: data?.dislike?.meal_percent,
        },
      ],
    };
    return arr;
  }, [data, t]);

  const handleChangeValue = (event, newValue) => setValue(newValue);
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const tabLabel = (text, isActive = false) => (
    <span className="px-1 text-xs">{text}</span>
  );

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
          <div className="text-lg font-bold">{t("reviews")}</div>
        </div>
      }
      extra={
        <>
          <StyledTabs value={value} onChange={handleChangeValue}>
            <StyledTab
              label={tabLabel(t("affirmative"))}
              {...a11yProps(0)}
              style={{ marginRight: "0px" }}
            />
            <StyledTab
              label={tabLabel(t("negatory"))}
              {...a11yProps(1)}
              style={{ marginRight: "0px" }}
            />
          </StyledTabs>
        </>
      }
      id="statisticsByComment"
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
        <DashboardPieChart
          data={value === 0 ? makeDate?.like : makeDate?.disLike}
          count={value === 0 ? data?.like?.all : data?.dislike?.all}
        />
      </div>
    </Card>
  );
};

export default ByComment;
