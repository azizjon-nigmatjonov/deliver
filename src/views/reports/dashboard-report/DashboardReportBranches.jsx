import Card from "components/Card";
import { monthColors } from "helpers/monthColors";
import moment from "moment";
import "moment/locale/ru";
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

function DashboardReportBranches({ branchesReport = [], barNameBranch }) {
  const barChatData = () => {
    let renameKeys = (keysMap, object) =>
      Object.keys(object).reduce(
        (acc, key) => ({
          ...acc,
          ...{ [keysMap[key] || key]: object[key] },
        }),
        {},
      );
    return branchesReport.map((item) => {
      let result = renameKeys(
        { amount: moment(item.date).locale("ru").format("MMM") },
        item,
      );
      return { ...result, name: moment(item.date).locale("ru").format("MMMM") };
    });
  };
  return (
    <Card>
      {branchesReport?.length ? (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            width={500}
            height={300}
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
            {barNameBranch.map((key) => (
              <Bar dataKey={key} maxBarSize={20} fill={monthColors(key)} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : null}
    </Card>
  );
}
export default DashboardReportBranches;
