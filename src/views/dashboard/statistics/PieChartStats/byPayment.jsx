import Card from "components/Card";
import RangePicker from "components/DateTimePicker/RangePicker";
import { DashboardCountIcon } from "constants/icons";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getOrderPayment } from "services";
import DashboardPieChart from "./PieChart";
import PaymeIcon from "../../../../assets/icons/newPayme.png";
import CashIcon from "../../../../assets/icons/newCash.png";
import ClickIcon from "../../../../assets/icons/newClick.png";
import ApelsinIcon from "../../../../assets/icons/newApelsin.png";
import TransferIcon from "../../../../assets/icons/newTransfer.png";

const ByPayment = () => {
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
    getOrderPayment(params).then((res) => setData(res));
  }, [date]);

  const makeDate = useMemo(() => {
    let colors = ["#FFD802", "#84CA85", "#FFA252", "#7048E8", "#F03E3E"];
    return data?.payments?.map((item, index) => ({
      icon:
        item.name === "payme" ? (
          <img width={25} src={PaymeIcon} alt="payme" />
        ) : item.name === "cash" ? (
          <img width={25} src={CashIcon} alt="cash" />
        ) : item.name === "click" ? (
          <img width={25} src={ClickIcon} alt="click" />
        ) : item.name === "apelsin" ? (
          <img width={25} src={ApelsinIcon} alt="apelsin" />
        ) : item.name === "transfer" ? (
          <img width={25} src={TransferIcon} alt="transfer" />
        ) : (
          ""
        ),
      name: t(item.name),
      value: item.amount,
      percent: item.percent,
      color: colors[index],
    }));
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
          <div className="text-lg font-bold">{t("payment.type")}</div>
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

export default ByPayment;
