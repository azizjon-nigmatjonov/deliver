import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { useTranslation } from "react-i18next";
import { formatPrice } from "utils/formatPrice";
import { useMemo } from "react";

const CustomTooltip = ({ active, payload, id }) => {
  return (
    <>
      <div
        style={{
          background: "white",
          boxShadow: "1px 2px 4px grey",
          padding: "10px 15px",
        }}
      >
        {payload && payload[0]?.payload?.name}:{" "}
        {payload && formatPrice(payload[0]?.payload?.value)}
      </div>
    </>
  );
};

const DashboardPieChart = ({ data, count }) => {
  const { t } = useTranslation();

  const total = useMemo(() => {
    if (count > 999999 && count < 9999999)
      return (count / 1000000).toFixed(2) + " млн";
    else if (count > 9999999 && count < 99999999)
      return (count / 1000000).toFixed(1) + " млн";
    else if (count > 99999999 && count < 999999999)
      return Math.trunc(count / 1000000) + " млн";
    else if (count > 999999999 && count < 9999999999)
      return (count / 1000000000).toFixed(2) + " млрд";
    else if (count > 9999999999 && count < 99999999999)
      return (count / 1000000000).toFixed(1) + " млрд";
    else if (count > 99999999999 && count < 999999999999)
      return Math.trunc(count / 1000000000) + " млрд";
    else return count;
  }, [count]);
  return (
    <div>
      <PieChart width={190} height={150} style={{ margin: "20px auto" }}>
        <text
          fontSize={14}
          fontWeight={700}
          x={95}
          y={70}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "15px" }}
        >
          {total < 1000000 ? formatPrice(total) : total}
        </text>
        <text
          x={95}
          y={85}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "10px" }}
        >
          {t("all.in")}
        </text>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={data}
          cx={"50%"}
          cy={"50%"}
          innerRadius={53}
          outerRadius={75}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
          stroke="2"
        >
          {data?.map((item) => (
            <Cell key={`cell-${item?.name}`} fill={item?.color} />
          ))}
        </Pie>
      </PieChart>

      <div className="grid grid-cols-2 gap-4 p-3">
        {data?.map((item) => (
          <div
            className="flex gap-1 items-center"
            style={{
              width:
                item.name === "Телеграмм бот"
                  ? "250px"
                  : item.name === "Время доставки"
                  ? "210px"
                  : "",
            }}
            key={item.name + item.color}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                background: item.color,
                borderRadius: "4px",
              }}
            />
            <div
              className="font-medium flex items-center gap-1"
              style={{ fontSize: "12px" }}
            >
              {item.icon ? item.icon : `${item.name}: `}
              {formatPrice(item.value)} ({item.percent}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPieChart;
