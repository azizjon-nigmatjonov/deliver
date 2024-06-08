import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Tooltip,
} from "recharts";
import Card from "components/Card";
import { chartColors } from "config/defaultSettings";
import Select from "components/Select";
import { useTranslation } from "react-i18next";

const MonthlyStatistics = ({
  data,
  selectedMonth,
  setSelectedMonth,
  statistics,
}) => {
  const { t } = useTranslation();


  const months = [
    {
      label: t("January"),
      value: 1,
    },
    {
      label: t("February"),
      value: 2,
    },
    {
      label: t("March"),
      value: 3,
    },
    {
      label: t("April"),
      value: 4,
    },
    {
      label: t("May"),
      value: 5,
    },
    {
      label: t("June"),
      value: 6,
    },
    {
      label: t("July"),
      value: 7,
    },
    {
      label: t("August"),
      value: 8,
    },
    {
      label: t("September"),
      value: 9,
    },
    {
      label: t("October"),
      value: 10,
    },
    {
      label: t("November"),
      value: 11,
    },
    {
      label: t("December"),
      value: 12,
    },
  ];

  return (
    <Card
      title="Ежемесячная статистика"
      extra={
        <Select
          id="months"
          width={200}
          value={selectedMonth}
          options={months}
          placeholder={t("choose.a.month")}
          onChange={(val) => setSelectedMonth(val)}
        />
      }
    >
      <ResponsiveContainer width="100%" height={310}>
        <BarChart width={730} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar
            // dataKey={`Доставка ${currentDayStatus?.delivery_orders_count}`}
            dataKey="Доставка"
            fill={chartColors.blue}
          />

          <Bar
            // dataKey={`Самовызов ${currentDayStatus?.self_pickup_orders_count}`}
            dataKey="Самовызов"
            fill={chartColors.green}
          />
          <Bar
            // dataKey={`Отмененны ${currentDayStatus?.canceled_orders_count}`}
            dataKey="Отмененны"
            fill={chartColors.red}
          />
          <Bar
            // dataKey={`Повторно оформленные ${currentDayStatus?.reissued_orders_count}`}
            dataKey="Повторно оформленные"
            fill={chartColors.orange}
          />
          <Bar
            // dataKey={`Итого ${currentDayStatus?.finished_orders_count}`}
            dataKey="Итого"
            fill={chartColors.purple}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MonthlyStatistics;
