import Card from "components/Card";
import { monthColors } from "helpers/monthColors";
import moment from "moment";
import { useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function DashboardReportCouriers({ courierReport = [] }) {
  const barChatData = () => {
    let renameKeys = (keysMap, object) =>
      Object.keys(object).reduce(
        (acc, key) => ({
          ...acc,
          ...{ [keysMap[key] || key]: object[key] },
        }),
        {},
      );
    return courierReport.map((item) => {
      let result = renameKeys(
        { amount: moment(item.date).format("MMM") },
        item,
      );
      return { ...result, name: moment(item.date).format("MMMM") };
    });
  };
  return (
    <Card>
      {courierReport?.length ? (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            width={730}
            height={250}
            data={barChatData()}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={moment(courierReport[0]?.date).format("MMM")}
              maxBarSize={20}
              fill={monthColors(moment(courierReport[0]?.date).format("MMM"))}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : null}
    </Card>
  );
}
export default DashboardReportCouriers;
