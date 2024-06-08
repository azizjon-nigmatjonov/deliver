import React from "react";
import { useTranslation } from "react-i18next";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { formatPrice } from "utils/formatPrice";

const ClientPieChartDashboard = ({ data }) => {
  const { t } = useTranslation();

  const sum = data.reduce((a, b) => {
    return a + b?.value;
  }, 0);

  return (
    // <ResponsiveContainer width="100%" height="100%">
    <PieChart width={190} height={150}>
      <text
        fontSize={14}
        fontWeight={700}
        x={95}
        y={70}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: "20px" }}
      >
        {sum ? formatPrice(sum) : 0}
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
      <Tooltip />
      <Pie
        data={data}
        cx={"50%"}
        cy={"50%"}
        innerRadius={50}
        outerRadius={70}
        fill="#8884d8"
        paddingAngle={0}
        dataKey="value"
        stroke="2"
      >
        {data?.map((entry) => (
          <Cell key={`cell-${entry?.color}`} fill={entry?.color} />
        ))}
      </Pie>
    </PieChart>
    // </ResponsiveContainer>
  );
};
export default ClientPieChartDashboard;
